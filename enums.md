## More on enumerations

Market data in finance

```
struct MessageHeader {
    uint64_t sequence_num;
    char type;  // One of 'A', 'M', 'D', 'T' etc
};
```

---

```
void handle(const MessageHeader &header, const void *payload) {
    if (header.type == 'A') {
        handleAdd(reinterpret_cast<AddMessage>(payload));
    } else if (type == 'M') {
        // ...
    }
}
```

```
enum class MessageType : char {
    Add = 'A',
    Modify = 'M',
    Delete = 'D',
    Trade = 'T'
};
```

---


```
struct MessageHeader {
    MessageType type;
};
```

// TODO https://godbolt.org/z/nMp3nI

```
void handle(const MessageHeader &header, const void *payload) {
    switch (header.type) {
        case MessageType::Add:
        return handleAdd(reinterpret_cast<AddMessage>(payload));
        // etc
        // NO DEFAULT
    }
    throw std::runtime_error("Invalid message type " + std::to_string(header.type));
}
```

---

Handle halt!
* Add 'H'
* show error

---

## Summary
- Use enum classes for any choices
- avoid `if`, use `switch`
- avoid `default` cases