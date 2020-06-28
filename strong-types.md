---

## Strong (Tiny) Types

Picture of an ant? Tiny Type

---

## Better?

class Price { /*...*/ };
class Quantity { /*...*/ };

---

* show error messages
```
<source>: In function 'void expensiveMistake()':
<source>:15:47: error: could not convert '1000' from 'int' to 'Quantity'
   sendOrder("GOOG", false, 1000, Quantity(100));
```

---


## Signed/unsigned?

* show that we might pass negative quantity
* try and fix?
```
  template<typename T>
  requires std::is_unsigned_v<T>
  constexpr explicit Quantity(T quantity) : quantity_(quantity) {}
```

---


or
```
  template<typename T>
  constexpr explicit Quantity(T quantity) : quantity_(quantity) {
      static_assert(std::is_unsigned_v<T>, "Please use only unsigned types");
  }
```
... and if you need signed support?

---


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
