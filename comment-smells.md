## Lambdas

Protecting invariants

```
class MyWidget {
    std::mutex mutex_;
public:
  void lock(); // must unlock after

  void tinkerWith(int amount); // must hold lock

  void unlock();
};
```

---
```
void tinker(MyWidget &widget) {
   widget.lock();
   widget.tinkerWith(123);
   widget.tinkerWith(333);
   widget.unlock();
}
```

---

```
class MyWidget {
  std::mutex mutex_;
public:
  [[nodiscard]] std::unique_lock<std::mutex> lock();
  void tinkerWith(int amount); // must hold lock
};
```

---

```
void tinker(MyWidget &widget) {
   widget.lock(); // Thank goodness for nodiscard
   widget.tinkerWith(123);
   widget.tinkerWith(333);
}
```

---

```
class MyWidget {
    std::mutex mutex_;

public:
  class Tinkerable {
      MyWidget &widget_;
      std::unique_lock<std::mutex> lock_;
      friend MyWidget;
      explicit Tinkerable(MyWidget &widget) : widget_(widget), lock_(widget_.mutex_) {}
    public:
      void tinkerWith(int amount);
  };

  Tinkerable get_tinkerable() { return Tinkerable(*this); }
};
```

```
void tinker(MyWidget &widget) {
    auto tinkerable = widget.get_tinkerable();
    tinkerable.tinkerWith(123);
    tinkerable.tinkerWith(333);
}
```

---

```

class MyWidget {
  std::mutex mutex_;
  class Tinkerable {
    int tinkerVal = 123;

  public:
    void tinkerWith(int amount);
  };
  Tinkerable tinkerable_;

public:
  template <typename TinkerFunc> void tinker(TinkerFunc func) {
    std::unique_lock lock(mutex_);
    func(tinkerable_);
  }
};

void tinker(MyWidget &widget) {
  widget.tinker([](auto &tinkerable) {
    tinkerable.tinkerWith(123);
    tinkerable.tinkerWith(333);
  });
}
```
// https://godbolt.org/z/aKjEXV

---

## "must be compiled" ?
https://godbolt.org/z/gFqA9t
https://godbolt.org/z/7f4WcD

and then what if "can't use compiler after compilation" ?
- https://godbolt.org/z/Khpo34 https://godbolt.org/z/-qXMcN

---

## Summary
- Protect invariants with code
- Apologetic comment anti-pattern
  - `// Must have lock` smells
- `clang-tidy` is your friend