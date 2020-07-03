
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

<div class=w40>

* `const` & `constexpr`
* Enumerations
* Lambdas

</div>

<div class=w60>

* RAII
* Static code analysis
* Strong types

</div>

---

## "But I don't make APIs"

---
## Trading System
<pre><code class="cpp" data-trim>
void sendOrder(
  const char *symbol, 
  bool buy,
  int quantity,
  double price);
</code></pre>

---

## Selling shares
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
