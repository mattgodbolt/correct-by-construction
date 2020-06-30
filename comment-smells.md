## Invariants

<pre><code class="cpp" data-line-numbers="|7|5,9" data-trim>
class MyWidget {
  std::mutex mutex_;

public:
  void lock(); // don't forget to unlock

  void tinker_with(int amount); // must hold lock

  void unlock(); // must be called after lock
};
</code></pre>

---

### A bad design?

<pre><code class="cpp" data-line-numbers="|2|3-4|5|" data-trim>
void tinker(MyWidget &widget) {
  widget.lock();
  widget.tinker_with(123);
  widget.tinker_with(333);
  widget.unlock();
}
</code></pre>

---

### Improvements!

<pre><code class="cpp" data-line-numbers="|5" data-trim>
class MyWidget {
  std::mutex mutex_;

public:
  std::scoped_lock&lt;std::mutex> lock();

  void tinker_with(int amount); // must hold lock
};
</code></pre>

---

### Spot the mistake?

<pre><code class="cpp" data-line-numbers="|2" data-trim>
void tinker(MyWidget &widget) {
  widget.lock();
  widget.tinker_with(123);
  widget.tinker_with(333);
}
</code></pre>

---

### Improvements!

<pre><code class="cpp" data-line-numbers="4|" data-trim>
class MyWidget {
  std::mutex mutex_;
public:
  [[nodiscard]] std::scoped_lock&lt;std::mutex> lock();
  void tinker_with(int amount); // must hold lock
};
</code></pre>

<pre class=fragment>
In function 'void tinker(MyWidget&)':
 error: ignoring return value of 'scoped_lock&lt;mutex> MyWidget::lock()',
        declared with attribute 'nodiscard' [-Werror=unused-result]
    |   widget.lock();
    |               ^
</pre>
---

### Improvements!

<pre><code class="cpp" data-line-numbers data-trim>
void tinker(MyWidget &widget) {
  auto lock = widget.lock();
  widget.tinker_with(123);
  widget.tinker_with(333);
}
</code></pre>

---

### Last apology

<pre><code class="cpp" data-line-numbers data-trim>
  void tinker_with(int amount); // must hold lock
</code></pre>

---

### Mutator interface

<pre><code class="cpp" data-line-numbers="|8" data-trim>
class MyWidget {
 std::mutex mutex_;

  void tinker_with(int amount);
public:
  class Tinkerable;

  Tinkerable get_tinkerable() { return Tinkerable(*this); }
};
</code></pre>

---

### Mutator interface

<pre><code class="cpp" data-line-numbers="|2-3|7-8|11-13" data-trim>
class MyWidget::Tinkerable {
  MyWidget &widget_;
  std::scoped_lock&lt;std::mutex> lock_;

  friend MyWidget;

  explicit Tinkerable(MyWidget &widget) 
    : widget_(widget), lock_(widget_.mutex_) {}
    
  public:
    void tinker_with(int amount) {
      widget_.tinker_with(amount);
    }
};
</code></pre>

---

### Using the Mutator interface

<pre><code class="cpp" data-line-numbers data-trim>
void tinker(MyWidge t &widget) {
  auto tinkerable = widget.get_tinkerable();
  tinkerable.tinker_with(123);
  tinkerable.tinker_with(333);
}
</code></pre>

---

### Don't call us, we'll call you
<pre><code class="cpp" data-line-numbers="|4-8|9|12-13" data-trim>
class MyWidget {
  std::mutex mutex_;

  class WidgetState {
    int state = 123;
  public:
    void tinker_with(int amount);
  };
  WidgetState state_;

public:
  template &lt;typename TinkerFunc>
  void tinker(TinkerFunc tinker_func);
};
</code></pre>

---
### Don't call us, we'll call you

<pre><code class="cpp" data-line-numbers="|3-4" data-trim>
template &lt;typename TinkerFunc>
void MyWidget::tinker(TinkerFunc tinker_func) {
  std::scoped_lock lock(mutex_);
  tinker_func(state_);
}
</code></pre>

---

### Don't call us, we'll call you

<pre><code class="cpp" data-line-numbers="|3-6" data-trim>
void tinker(MyWidget &widget) {
  widget.tinker(
    [](auto &tinkerable) {
      tinkerable.tinker_with(123);
      tinkerable.tinker_with(333);
    }
  );
}
</code></pre>

---

### Other comment smells

<pre><code class="cpp" data-line-numbers="|3|5-6|8-10" data-trim>
class ShaderRegistry {
public:
  void add(const char *shader);

  // once all shaders are added, compile
  void compile();

  // get a compiled shader by name.
  // must be compiled and linked!
  CompiledShader &get_compiled(const char *name) const;
};
</code></pre>

---

### Separating concerns

<pre><code class="cpp" data-line-numbers="|8|10|1-4|3" data-trim>
class CompiledShaders {
public:
  CompiledShader &get_compiled(const char *name) const;
};

class ShaderCompiler {
public:
  void add(const char *shader);

  [[nodiscard]] CompiledShaders compile() const;
};
</code></pre>

### Separating concerns

<pre><code class="cpp" data-line-numbers data-trim>
void use() {
  ShaderCompiler compiler;
  compiler.add("bob");
  compiler.add("dawn");

  auto shaders = compiler.compile();
  shaders.get_compiled("bob").render();
}
</code></pre>

---

### Destructive separation

<pre><code class="cpp" data-line-numbers="|5-8" data-trim>
class ShaderCompiler {
public:
  void add(const char *shader);

  // Resources used in compilation are transferred
  // to the CompiledShaders: you cannot call compile()
  // twice!!
  [[nodiscard]] CompiledShaders compile();
};
</code></pre>

---

### Destructive separation

<pre><code class="cpp" data-line-numbers="|5" data-trim>
class ShaderCompiler {
public:
  void add(const char *shader);

  [[nodiscard]] CompiledShaders compile() &&;
};
</code></pre>

---

### Destructive separation

<pre><code class="cpp" data-line-numbers="|6" data-trim>
void use() {
  ShaderCompiler compiler;
  compiler.add("bob");
  compiler.add("dawn");

  auto shaders = std::move(compiler).compile();
  shaders.get_compiled("bob").render();
}
</code></pre>

---

### Destructive separation

<pre><code class="cpp" data-line-numbers data-trim>
CompiledShaders compile() {
  ShaderCompiler compiler;
  compiler.add("bob");
  compiler.add("dawn");
  return compiler.compile();
}

void use() {
  auto shaders = compile();
  shaders.get_compiled("bob").render();
}
</code></pre>

---

### Destructive separation

<pre><code class="cpp" data-line-numbers="|1|3-4" data-trim>
  auto shaders = std::move(compiler).compile();
  shaders.get_compiled("bob").render();
  // oops
  compiler.add("persephone");
</code></pre>

<pre class=fragment>
Compiler returned: 0
</pre>

---

### clang-tidy

<pre>
warning: 'compiler' used after it was moved
  compiler.add("persephone");
  ^
move occurred here:
  auto shaders = std::move(compiler).compile();
                 ^
</pre>

---

## Summary
- Protect invariants with code
- Apologetic comment anti-pattern
  - `// Must ..` smells
- Separation of concerns
- `clang-tidy` is your friend