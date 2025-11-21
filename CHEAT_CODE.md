# 🔓 Hidden Cheat Code System (GTA San Andreas Style)

## How to Activate the Cheat Code

The quiz includes a **hidden keyboard shortcut** inspired by classic GTA San Andreas cheats!

### Cheat Key Sequence
Press the following arrow keys in order while on the quiz screen:

```
↑ ↑ ↓ ↓ ← → ← →
```

**Keyboard input:**
1. **Up Arrow**
2. **Up Arrow**
3. **Down Arrow**
4. **Down Arrow**
5. **Left Arrow**
6. **Right Arrow**
7. **Left Arrow**
8. **Right Arrow**

This is the **UUDDLRLR** sequence - the classic Konami Code!

### What Happens When Activated
When you enter the cheat code sequence:
- ✅ Quiz instantly completes
- 🏆 Perfect score: **4000 points**
- 📊 All 30 questions marked as correct
- ⏱️ 0 wrong attempts
- 🎵 Success audio plays
- 📍 You're immediately taken to the Result Screen

### Why This Design?
- **Nostalgic**: Uses the iconic Konami Code / GTA cheat style
- **Arrow keys only**: Simple and straightforward
- **No modifiers needed**: Just press arrow keys in sequence
- **Easy to remember**: UUDDLRLR is legendary in gaming culture
- **Invisible feedback**: No on-screen indication the cheat is being tracked

### Technical Details

**Frontend Implementation:**
- Listens for `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` keypresses
- Builds a sequence string from arrow key presses
- Keeps only the last 8 keypresses (length of cheat sequence)
- Detects when sequence matches UUDDLRLR pattern
- Instantly triggers cheat activation without visual feedback

**Backend Implementation:**
- New endpoint: `POST /api/quiz/cheat/activate`
- Validates cheat code: `CIPHER_OVERRIDE_9X2Z`
- Instantly marks quiz as completed with perfect stats
- Returns final score, correct answers, and remaining time

---

## Testing

1. Start the quiz
2. Press arrow keys in sequence: **Up, Up, Down, Down, Left, Right, Left, Right**
3. You should instantly see the Result Screen with:
   - Perfect Score: 4000
   - Accuracy: 100%
   - Grade: S (Excellent)
   - 0 wrong attempts

---

**Pro Tip**: Just like GTA cheats - try it at any time during the quiz! 🎮


