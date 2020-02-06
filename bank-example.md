## Bank Example

<pre><code class="cpp" data-trim>
// TODO maybe drop this entirely? or make it one-sided, with signed
// side? then `Money` can have a credit() and debit() ?
struct Transaction {
  unsigned long fromId; 
  unsigned long toId;
  unsigned long amountInPennies; 
};

struct Account {
  unsigned long id;
  vector&lt;Tx> transactions;
  long balanceInPennies;
};
</code></pre>

---

<pre><code class="cpp" data-trim>
bool transfer(Account *from, Account *to, 
              unsigned long amountInPennies) {
  if (from->balanceInPennies < amountInPennies)
    return false;              
    
  Transaction tx{from->id, to->id, amountInPennies};
  
  from->balanceInPennies -= amountInPennies
  from->transactions.emplace_back(tx);
  
  to->balanceInPennies += amountInPennies;
  to->transactions.emplace_back(tx);
  
  return true;
}
</code></pre>

---

### Problems!

* What if `from` or `to` is `nullptr` ?
* What if you `mix` up `from` or `to` ?
* (exception safety?)

---

<pre><code class="cpp" data-trim>
class Account {
  unsigned long id_;
  vector&lt;Tx> transactions_;
  long balanceInPennies_;
  
public:
  explicit Account(unsigned long id);
  bool transferTo(Account &amp;toAccount, unsigned long amountInPennies);
};
</code></pre>

---

<pre><code class="cpp" data-trim>
bool Account::transferTo(
    Account &amp;toAccount, unsigned long amountInPennies) {
  if (balanceInPennies_ < amountInPennies)
    return false;              
    
  Transaction tx{id_, to.id_, amountInPennies};
  
  balanceInPennies_ -= amountInPennies
  transactions_.emplace_back(tx);
  
  to.balanceInPennies_ += amountInPennies;
  to.transactions_.emplace_back(tx);
  
  return true;
}
</code></pre>

---

### Problems!

* `amountInPennies`
* `Transaction` arguments!

---

<pre><code class="cpp" data-trim>
class Money {
  long pennies_;

public:
  static Money dollars(long dollars)
    { return Money { dollars * 100 }; }
  static Money pennies(long pennies) 
    { return Money { pennies }; }
  
  long toPennies() const { return pennies_; }
  string to_string() const;
  
  // comparison, etc ... operator <=> soon!
};
</code></pre>

---

* TODO UDLs
* Can also apply to `AccountId`

---

<pre><code class="cpp" data-trim>
struct Transaction {
  AccountId fromId; 
  AccoundId toId;
  Money amount; 
};
</code></pre>

---

### Arg order

<pre><code class="cpp" data-trim>
class TxBuilder {
  AccountId from_;
  Money amount_;
public:
  [[nodiscard]]
  static TxEr transfer(AccountId from, Money amount) {
    return TxBuilder { id, amount };
  }
  [[nodiscard]]
  Transaction to(AccountId id) const {
    return Transaction{from_, id, amount_};
  }
};
</code></pre>

---

<pre><code class="cpp" data-trim>
  if (balance_ < amount)
    return false;              
    
  auto tx = TxBuilder::transfer(id_, amount).to(to.id_);
  
  balance_ -= amount;
  transactions_.emplace_back(tx);
  
  to.balance_ += amount;
  to.transactions_.emplace_back(tx);
  
  return true;
</code></pre>

---

<pre><code class="cpp" data-trim>
// TODO not thread safe?
[[nodiscard]]
const vector&lt;Tx> transactions() const;
</code></pre>
