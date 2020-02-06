## C++ is powerful

* strong types
* templates
* RAII
* OO design/inheritance/virtual methods

---

## API design conundrum

---

## "But I don't make libraries"

* amusing stuffz here? 

---

## Disaster waiting to happen

<pre><code class="cpp" data-line-numbers="|1|3-5|6-8" data-trim>
void sendOrder(const char *symbol, bool buy, int qty, double price);
/* ... */
void sellMyGoogleShares() {
  sendOrder("GOOG", false, 100, 1000);
}
void expensiveMistake() {
  sendOrder("GOOG", false, 1000, 100);
}
</code></pre>
