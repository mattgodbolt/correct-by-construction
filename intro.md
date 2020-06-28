
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

* `const`
* `constexpr`
* Enumerations
* Lambdas
* RAII
* Static code analysis
* Strong types

---

## "But I don't make APIs"

---
## Trading System
<pre><code class="cpp" data-trim>
void sendOrder(const char *symbol, bool buy, int qty, double price);
</code></pre>

---

<pre><code class="cpp" data-line-numbers data-trim>
void sellMyGoogleShares() {
  sendOrder("GOOG", false, 100, 1000.00);
}
</code></pre>

<pre class="fragment"><code class="cpp" data-line-numbers data-trim>
void expensiveMistake() {
  sendOrder("GOOG", false, 1000.00, 100);
}
</code></pre>
