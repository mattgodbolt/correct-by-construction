## Strong (Tiny) Types

Picture of an ant? Tiny Type

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


<pre><code class="cpp" data-line-numbers= data-trim>
template&lt;typename T>
constexpr explicit Quantity(T quantity) 
  : quantity_(quantity) {
    static_assert(std::is_unsigned_v&lt;T>,
                  "Please use only unsigned types");
}
</code></pre>

<pre class=fragment><code class="cpp" data-line-numbers data-trim>
template&lt;typename T>
requires std::is_unsigned_v&lt;T>
constexpr explicit Quantity(T quantity)
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

HERE <<<<>>>>
```
  static Quantity from_int(int quantity) {
      if (quantity < 0) throw std::runtime_error("Invalid quantity");
      return Quantity(static_cast<unsigned>(quantity));
  }
```

---

Then `Quantity(100u)` needs the `u`, which is cool and all but

```
constexpr Quantity operator ""_qty(unsigned long long value) {
    if (value > /*TODO*/) throw std::runtime_error("Quantity too large");
    return Quantity(value);
}

void sellMyGoogleShares() {
  sendOrder("GOOG", false, 100_qty, 1000);
}
```

- also strong types fluent c++

---

```
void sendOrder(const char *symbol, bool buy, Quantity qty, Price price);

void buyGoogle() {
    sendOrder("GOOG", false, 100_qty, 1000_dollars);
}
```

```
enum class BuyOrSell {
    Buy,
    Sell
};

void buyGoogle() {
    sendOrder("GOOG", BuyOrSell::Buy, 100_qty, 1000_dollars);
}
```

---

## what about performance!?

```
void buySomeGoogle(int qty, int dollars) {
  sendOrder("GOOG", BuyOrSell::Sell, Quantity::from(qty),
            Price::from_dollars(dollars));
}
```
https://godbolt.org/z/jCiY2s


---
## Summary

* Use strong types
  - Write your own
  - [joboccara/NamedType](https://github.com/joboccara/NamedType)
* Constrain at compile time
* UDLs
* Avoid naked `bool`s
