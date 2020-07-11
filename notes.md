
---

### Overview
- Intro
  - C++ is powerful. Lots of choices
    - strong types
    - RAII
    - templates
    - virtual functions
  - What does it mean for users of your API?
    - why care? I just write apps?
    - You are your own user
    - Nobody is as dumb as "tomorrow-you"
    - Nobody's API design sucks as much as "yesterday you"
- Story time (maybe)
  - strong types ftw
- Bank example
  - Simple version, no encaps. list<tx> and balance
  - Class invariants! sum(tx) == balance! Add functions
  - Hide data: encapsulation
  - Withdraw function -> `bool`.
    - `[[nodiscard]]`
  - `Money` type to get rid of `balanceInPennies`
    - show it has no overhead over `long`
    - maybe `[[nodiscard]]` can be shored up
    - user-defined literals, good for tests!
  - Auditing...hiding `Transaction`, return const ref
    - discuss tradeoffs
  - Transfers between accounts
  - Threading!!
    - show mutex is easy to add! Yay thread safe
    - boo though:
      - (potential) deadlock between accounts
        - show how to get locks in order (is there a new thing for this?)
          - `std::lock()` and `std::scoped_lock` to look at
      - `const &` no longer good: approaches:
        - return a copy of Vector
          - what about the balanceInPennies?
        - return a snapshot of the class
        - `runUnderLock()`
  - Final version
- Other techniques
  - builder pattern/named paramters
  - Type gymnastics ; returning proxy objects which only allow "next" thing to be done? (Jordan's idea from below)
- Review and Conclusion
  - Strong types
  - RAII
  - Encapsulation
  - Lambdas/passing in mutation functions
  - `static_assert`

---

Ideas for named params

- need motivating example for defaults?
```cpp
void trade(BuySell s, Stock stock, Price target, Qty qty,
           optional<Price> minPx,
           optional<Price> maxPx,
           optional<duration> blah);
struct AlgoParams {
    AlgoParams(required params);
    AlgoParams &withMinPx(...);
};

trade(Buy, GOOG, 12_dollars, 50_qty,
     AlgoParams()
        .withMinPx(12).withMaxPx(123);

```

maybe?

---

* TODO come up with motivating example:
  - atomic updates required
  - probably read-modify-update
  - more complex than just += or -=
  - NO `Foo` or `Bar`, all must be real things
  - gonna be shown in UK and france, so amusing theme?
  - could be protecting a `map` or something more complex
  
---

# Case study?

struct Account {
  vector<Tx> transaction;
  long balanceInPennies;
  // overdraft?
};

thread safe!

struct Account {
  mutex lock;
  vector<Tx> transaction_; // must have lock!
  long balanceInPennies_; // must have lock
};

MAYBE?
* account and txes
* data hiding
* give behaviour, "credit" and "debit"
* `long` -> `Money` class? Show ratio class? types/dimensions?
* maybe-->
  * apply transaction (pointer?) could show lifetime there
* add a `const` reference to transactions.. it's `const`!!!!
  * show that threading will be a problem! what if it changes under us
* "Audit" long-lived thread?
  * add lock/unlock, show it's a problem
  * return `unique_lock`, show what if we look at the transactions
* Actual transfers between accounts?
  * consistent locking behaviour?

<pre><code class="cpp" data-trim>
class Account
{
  std::mutex lock_;
  std::vector&lt;Transactions> transactions_;
  long balanceInPennies_;

public:
  void deposit(long pennies);
  bool withdraw(long pennies); // here's another one...? `[[nodiscard]]` ? Some type that has to be explicitly zeroed?
  const vector&lt;Tx> transactions() const; // uh oh  
};
</code></pre>

---

* NB apologetic comment smell
* atomic update function
* RAII return unique_lock
* withLock()/forEach() type thing

---

Notes!

* Smells
  * naked `new` or `delete`
  * apologetic comments: `// Must have the lock held`
* Techniques
  * Strong types
  * Parameter holder objects/ "named" parameters (see builders)
  * RAII
  * Lambdas (`runUnderLock(...)`)
  * Builder patterns
    * testing of same
* Testability
* Performance (!)

How to arrange?

* Initialisation and calling
  * types
  * parameter holders
  * builder patterns
* Lifetimes
  * RAII?
* Preserving Invariants
  * Locking
  * "commit" pattern
  * Using types (concepts?)
  
Thoughts from Ben:
* Clojure's "actor pattern" means you have to pass functions to mutate state (like lambda thing)
* strings are a common source of things that could be more constrained by construction:
  * GUIDs
  * URLs
  
Also:
* linting tools
* sanitizers?

More thoughts:
* SignedQty vs (non-signed) Quantity?


* jordan mentioned "call doX then doY" -> instead doX return object with only "doY"
  - "commit" mutation? (commit pattern above)
  - this is the TypeRegistry/Scope thing?
  
- auto and expensive copy construction.
  
CppCast with Hana on C++20 talked about deprecating, making `bool` param from `const char *` etc bad
Maybe look into and show this?

### principal of least surprise

...

the "assert(false);" antipattern https://github.com/NREL/EnergyPlus/blob/develop/third_party/ObjexxFCL/src/ObjexxFCL/IOFlags.cc#L47-L67

* maybe can use kids as "spanish inquisition" live gag?



New list:
* INTRO
* Pontification
  * Good code is like Lego
  * Bad code should be hard to write
  * API design can help that
  * "if it compiles, it works" good to aim at
  * Principal of least surprise (maybe?)
    * minimise side effects (logging, printing, etc)
  * Comments as a smell?
* Strong value types
  * motivating examples
* Two phase construction? avoid? (set up for below)
* Parameters
  * Use strong types
  * Avoid bools, same type twice
  * Reduce number of params
    * parameter holders?
    * builders?
* lock...unlock
  * RAII
  * pre/post conditions? 
    * runUnderLock
* references? pointers?
  * using const ref
    * keeping a ref...
  * Using u_ptr and s_ptr or non_owning ptr etc
* templatery
  * static assert
  * concepts?
* Conclusion!
  * One line recap for each?
  * Thank you


- work in progress on price and quantity classes:
  - https://godbolt.org/z/j56zuY

- work in progress on message
  - https://godbolt.org/z/nMp3nI


### first run at home
- timings
  - 18m to "Performance"
  - 25m to "Market Data"
  - 32m to lambdas
  - 40m clearly "done" but not really done well 


- from comment-smells
https://godbolt.org/z/aKjEXV
https://godbolt.org/z/gFqA9t
https://godbolt.org/z/7f4WcD


--- NOTES FROM FIRST IN PERSON

RD notes:
endOrder example:
give some nod to warnings
Critique of aliases:
Aliases give a hint to the developer, with no hint to the compiler
Quantity contract check on bounds of qty: Likely to get questions regarding usage of contracts or cost of exception
Enum switches:
Appeal to warning to protect you, but disregarded it, above
--- mg note - which flags are on  Wall Wextra; disregard = signed/unsigned, 'eu-central-1'
    - -Wsign-conversion
Could add a "Count" value to end of the enum and static_assert at the point of the switch that it's a particular size
get_tinkerable() hides the creation of the lock, making it more likely that a consumer will inadvertently deadlock, as they try to get a tinkerable in some path, while another tinkerable is still alive
move... compile()... could just make compile() destructive, by moving state into CompiledBlah. Need to make origin class have a default state that is well-behaved after compile() is called
General: May be worth having a quick nod to Ben's idea of Seattle Sure and the ever present drive to give stronger correctness guarantees

PF notes:
Maybe show a couple more examples of transposing parameters. Specifically something non-trading
Maybe a code example of a call with a non-explicit constructor that does the wrong thing?
For the mathy types, Negative numbers integers are in fact "countable" :)
Ladder explanation is a little fast for non finance people. Example of an order coming in?
Mighet want to explain that AddMesssage is aka a NewOrder
Could emphasise that [nodiscard] specifically exists for better apis (haven't thought about it but might want to call out other language features you are covering that are explicitly in there to make your apis better)
True that RAII is useful for more than good apis, but since you're talk is about apis might want to steer away from those uses.

TM notes: "be careful about quantity <-> shares"

LA notes:
General:
 - I'm a fan of slide numbers so it's easy to refer back to stuff (I realize I didn't add them to my own slides in my last presentations lmao)
 - Sort of re: what TM said, it might be good for your two trading examples to make it clear that you're just using trading as examples. With us it's easy to transition into: yeah here's another trading thing, but I think for others being explicit about: I chose to use trading here might help? idk

Things you said to yourself that I wrote down in case you forgot:
 - On Hello! slide 'should have added Google'
 - Maybe add Feathers quote about code is how you treat coworkers
 - "the future" slide at the end should be removed
 - More color on the unsigned int from negative number - not two's complement - I know you asked Rob about this, so maybe you have clearer in your mind now
 - Split separating concerns slide into two

Things that could maybe be explained a bit more:
 - Maybe make clear that the 'from' function needs to be explicitly called. See this later, but there's so much 'magic' in C++ that initially I wasn't sure if this was something I could expect to be done for me
 - Explain the narrowing conversion and how that does what we want it to
 - Sort of understood how the constexpr gets us compile time check, but immediately said that in that function the from is still at run time, so maybe a little clearer how that plays together
 - Mentioned the 'friend myWidget' in passing but sort of brushed it off, might be worth taking out/being explicit that you won't discuss
 - A little confused about the && addition
 - Subscriber discussion was a little disjoint, but I know this is part that's going to be worked on more anyway
 - Might want to mention what those -W flags actually do

The Good!!:
 - I don't think you talked too fast!
 - Super useful info
 - In general easy to understand and generally simple stuff that even C++ noobs such as myself can grasp
 - Good RAII explanation
 - A+ simple slides, easy for structure but you don't just read them


--------- super immportant!

UDL SECTION IS WRONG WRONG!!!

constexpr std::byte operator"" _b(unsigned long long t) {
  return std::byte(gsl::narrow<uint8_t>(t));
}

doesn't throw on `auto x = 1000_b;` -- needs `constexpr`

NO%^^^ NEEDS CONSTEVAL!! :D


## What about performance!?

[Let's see!](https://godbolt.org/z/Sn6k9-)


.... ok!
Run through Thursday: 56m no stopping.
