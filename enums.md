## Enumerations

Market data in finance

![ladder](images/TwtrLadder.png)

---

### Market data

<pre><code class="cpp" data-line-numbers="|1-6|5|8-13|" data-trim>
// Must be 13 bytes long to match vendor spec.
struct MessageHeader {
  uint64_t sequence_num;
  uint32_t message_size;
  char type;      // One of 'A', 'M', 'D' etc
};
// Header is immediately followed by one of...
struct AddMessage {
  uint64_t order_id;
  uint32_t symbol_id;
  int32_t price;
  uint32_t quantity;
  char side;
};
// and struct ModifyMessage, DeleteMessage...
</code></pre>

---

### First things first

<pre><code class="cpp" data-line-numbers="|1" data-trim>
// must be 13 bytes long to match spec
struct MessageHeader {
  uint64_t sequence_num;
  uint32_t message_size;
  char type;      // One of 'A', 'M', 'D' etc
};
</code></pre>

---

### First things first

<pre><code class="cpp" data-line-numbers="7" data-trim>
struct MessageHeader {
  uint64_t sequence_num;
  uint32_t message_size;
  char type;      // One of 'A', 'M', 'D' etc
};

static_assert(sizeof(MessageHeader) == 13);
</code></pre>

<pre class=fragment>
error: static assertion failed
 | static_assert(sizeof(MessageHeader) == 13);
 |               ~~~~~~~~~~~~~~~~~~~~~~^~~~~
</pre>
---

### First things first

<pre><code class="cpp" data-line-numbers="1" data-trim>
struct [[gnu::packed]] MessageHeader {
  uint64_t sequence_num;
  uint32_t message_size;
  char type;      // One of 'A', 'M', 'D' etc
};

static_assert(sizeof(MessageHeader) == 13);
</code></pre>

---

### Handling

<pre><code class="cpp" data-line-numbers="|1-3|5-13|6|7" data-trim>
void handle(const AddMessage &add_message);
void handle(const ModifyMessage &mod_message);
void handle(const DeleteMessage &del_message);

void handle(const MessageHeader &header, const void *payload) {
  if (header.type == 'A') {
    handle(*reinterpret_cast&lt;const AddMessage *>(payload));
  } else if (header.type == 'M') {
    handle(*reinterpret_cast&lt;const ModifyMessage *>(payload));
  } else if (header.type == 'D') {
    handle(*reinterpret_cast&lt;const DeleteMessage *>(payload));
  }
}
</code></pre>

---

### Handling

<pre><code class="cpp" data-line-numbers data-trim>
void handle(const MessageHeader &header, const void *payload) {
  switch (header.type) {
  case 'A': 
    handle(*reinterpret_cast&lt;const AddMessage *>(payload));
    break;
  case 'M': 
    handle(*reinterpret_cast&lt;const ModifyMessage *>(payload));
    break;
  case 'D':
    handle(*reinterpret_cast&lt;const DeleteMessage *>(payload));
    break;
  }
}
</code></pre>


---

### Enumerations

<pre><code class="cpp" data-line-numbers data-trim>
enum class MessageType : char {
  Add = 'A',
  Modify = 'M',
  Delete = 'D'
};
</code></pre>


---

### Enumerations

<pre><code class="cpp" data-line-numbers="|4" data-trim>
struct MessageHeader {
  uint64_t sequence_num;
  uint32_t message_size;
  MessageType type;
};
static_assert(sizeof(MessageHeader) == 13);
</code></pre>

---

### Enumerations

<pre><code class="cpp" data-line-numbers data-trim>
void handle(const MessageHeader &header, const void *payload) {
  switch (header.type) {
  case MessageType::Add:
    return handle(*reinterpret_cast&lt;const AddMessage *>(payload));
  case MessageType::Modify:
    return handle(*reinterpret_cast&lt;const ModifyMessage*>(payload));
  case MessageType::Delete:
    return handle(*reinterpret_cast&lt;const DeleteMessage*>(payload));
  }

  throw std::runtime_error(
    "Invalid message type " + std::to_string(
        static_cast&lt;int>(header.type)));
}
</code></pre>

---

### So why is this better?

<div class=fragment>We forgot to handle a message!</div>

---

### Trades!

<pre><code class="cpp" data-line-numbers="|5" data-trim>
enum class MessageType : char {
  Add = 'A',
  Modify = 'M',
  Delete = 'D',
  Trade = 'T'
};
</code></pre>

---

### Trades!

<pre>
In function 'void handle(const MessageHeader&, const void*)':
warning: enumeration value 'Trade' not handled in switch [-Wswitch]
 |   switch (header.type) {
 |          ^
</pre>

---

## Summary
- `static_assert` on whatever invariants you can
- Use enum classes for any choices
  - even sized ones
- avoid `if`, use `switch`
  - avoid `default` cases
- `-Wall -Wextra -Werror`