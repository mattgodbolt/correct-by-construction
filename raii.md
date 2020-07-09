## RAII

* Not just for "resources"
* CADR
  - Constructor Acquires
  - Destructor Releases

---

### Subscribers

<pre><code class="cpp" data-line-numbers="|3-6|8-10" data-trim>
class EventSource {
public:
  struct Listener {
    virtual ~Listener() = default;
    virtual void on_event() = 0;
  };

  // Don't forget to unsubscribe!
  void subscribe(Listener &listener);
  void unsubscribe(Listener &listener);
};
</code></pre>

---

### Subscriptions

<pre><code class="cpp" data-line-numbers="|6|9|11" data-trim>
class EventSource::Subscription {

  Subscription(EventSource &source, 
               Listener &listener)
  : source_(source), listener_(listener) 
    { source_.add(listener_); }

  ~Subscription()
    { source_.remove(listener_); }

  // ...special member functions...
</code></pre>

---

### Subscriptions

<pre><code class="cpp" data-line-numbers="|7-11" data-trim>
class EventSource {
  // ...
  void add(Listener &listener);
  void remove(Listener &listener);

public:
  [[nodiscard]]
  Subscription subscribe(
      Listener &listener) {
    return Subscription(*this, listener);
  }
};
</code></pre>

---

### Summary

- RAII/CADR is not just for resources
  - Recursion depth
  - Handling re-entrancy
  - Timers
