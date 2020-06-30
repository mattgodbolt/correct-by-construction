## Strong Value Types

TODO: Picture of an ant?

---

### Better?

<pre><code class="cpp" data-line-numbers="1-2|4-8|10-11" data-trim>
using Price = double;
using Quantity = int;

void sendOrder(const char *symbol,
               bool buy,
               Quantity qty,
               Price price);

void expensiveMistake() {
  sendOrder("GOOG", false, 
            Price(1000.00), Quantity(100));
}
</code></pre>

---

### Better!

<pre><code class="cpp" data-line-numbers data-trim>
class Price {/*...*/};
class Quantity {/*...*/};

void sendOrder(const char *symbol,
               bool buy,
               Quantity qty,
               Price price);
</code></pre>

---

### Better!

```
In function 'void expensiveMistake()':
error: could not convert 'Price(1000.00)' from 'Price' to 'Quantity'
             Price(1000.0),
             ^
error: could not convert 'Quantity(100)' from 'Quantity' to 'Price'
             Quantity(100),
             ^
```

---

### Quantity

<pre><code class="cpp" data-line-numbers="|2|5-6|8" data-trim>
class Quantity {
  int quantity_;

public:
  explicit Quantity(int quantity) 
    : quantity_(quantity) {}

  int value() const { return quantity_; }
};
</code></pre>

---

### Quantity

<pre><code class="cpp" data-line-numbers data-trim>
Quantity oneHundred(100);
</code></pre>

<pre class=fragment><code class="cpp" data-line-numbers data-trim>
Quantity thisDoesntSeemRight(-100);
</code></pre>

---

### Quantity

`int` -> `unsigned int`

<pre><code class="cpp" data-line-numbers="|2|5-6|8" data-trim>
class Quantity {
  unsigned int quantity_;

public:
  explicit Quantity(unsigned int quantity) 
    : quantity_(quantity) {}

  unsigned int value() const { return quantity_; }
};
</code></pre>

---

### Quantity

<pre><code class="cpp" data-line-numbers data-trim>
Quantity thisDoesntSeemRight(-100);  // Still compiles just fine
</code></pre>

---

### Quantity


<pre><code class="cpp" data-line-numbers data-trim>
template&lt;typename T>
explicit Quantity(T quantity) 
  : quantity_(quantity) {
  static_assert(std::is_unsigned_v&lt;T>,
                "Please use only unsigned types");
}
</code></pre>

<pre class=fragment><code class="cpp" data-line-numbers data-trim>
template&lt;typename T>
requires std::is_unsigned_v&lt;T>
explicit Quantity(T quantity)
  : quantity_(quantity) {}
</code></pre>

---

### Quantity

<pre><code class="cpp" data-line-numbers data-trim>
Quantity thisDoesntSeemRight(-100); 
</code></pre>

<pre class=fragment>
error: no matching function for call to 'Quantity::Quantity(int)'
      | Quantity thisDoesntSeemRight(-100);
      |                                  ^
note: candidate: 'constexpr Quantity::Quantity(T) [with T = int]'
      | constexpr explicit Quantity(T quantity) : quantity_(quantity) {}
      |                    ^~~~~~~~
note: constraints not satisfied
note: the expression 'is_unsigned_v<T> [with T = int]' evaluated to 'false'
      | requires std::is_unsigned_v<T>
</pre>

---

### Quantity

<pre><code class="cpp" data-line-numbers="1|2|3" data-trim>
Quantity wouldBeNiceIfThisWorked(100);  // but fails to compile
Quantity butWeHaveToDoThis(100u);
Quantity whatAboutThis(static_cast&ltunsigned int>(atoi("123")));
</code></pre>

---

### Quantity

<pre><code class="cpp" data-line-numbers data-trim>
template&lt;typename T>
static Quantity from(T quantity) {
  if (quantity &lt; 0 || quantity > Quantity::max())
    throw std::runtime_error("Invalid quantity");
  return Quantity(static_cast&lt;std::make_unsigned&lt;T>>(quantity));
}
</code></pre>
<div class="fragment">or...
<pre><code class="cpp" data-line-numbers data-trim>
template&lt;typename T>
static Quantity from(T quantity) {
  return gsl::narrow&lt;decltype(quantity_)>(quantity);
}
</code></pre></div>


---

### Quantity

<pre><code class="cpp" data-line-numbers="1-3|5-8|10-12" data-trim>
constexpr Quantity operator""_qty(unsigned long long value) {
  return Quantity::from(value);
}

// assuming similar Price class...
constexpr Price operator""_dollars(unsigned long long value) {
  return Price::from_dollars(value);
}

void sellMyGoogleShares() {
  sendOrder("GOOG", false, 100_qty, 1000_dollars);
}
</code></pre>

---

### Finishing touches

<pre><code class="cpp" data-line-numbers="|4" data-trim>
void buyMoreGoogleShares() {
  sendOrder(
    "GOOG",
    false, 
    50_qty, 
    975_dollars);
}
</code></pre>

---

### Finishing touches

<pre><code class="cpp" data-line-numbers="|1-3|8" data-trim>
enum class BuyOrSell {
  Buy, Sell
};

void buyMoreGoogleShares() {
  sendOrder(
    "GOOG",
    BuyOrSell::Buy, 
    50_qty, 
    975_dollars);
}
</code></pre>

---

## What about performance!?

[Let's see!](https://godbolt.org/z/Sn6k9-)

---

## Summary

* Use strong types
  - Write your own
  - [joboccara/NamedType](https://github.com/joboccara/NamedType)
* Constrain at compile time
* UDLs
* Avoid naked `bool`s
* _Very_ low overhead
