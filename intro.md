
## Correct by construction?

<ul>
<li class="fragment">If it compiles, it's right<span class="fragment"> (probably)</span></li>
<li class="fragment">Obviously wrong code should not compile</li>
</ul>

---

## Hello!

* Games
* C++ Tools
* Finance

---

## Toolbox

* Strong types
* RAII
* `const` & `constexpr`
* Lambdas

---

## "But I don't make APIs"

---
## Trading System
<pre><code class="cpp" data-trim>
void sendOrder(const char *symbol, bool buy, int qty, double price);
</code></pre>

---

<pre class="fragment"><code class="cpp" data-line-numbers="|1|3-5|6-8" data-trim>
void sellMyGoogleShares() {
  sendOrder("GOOG", false, 100, 1000.00);
}
</code></pre>

<pre class="fragment"><code class="cpp" data-line-numbers="|1|3-5|6-8" data-trim>
void expensiveMistake() {
  sendOrder("GOOG", false, 1000.00, 100);
}
</code></pre>
