# 🔌 API QUICK REFERENCE

**Offensive Security Quiz Game API - v1.0.0**

Status: ✅ **FULLY OPERATIONAL**

---

## 📍 Base URL
```
http://localhost:5000/api
```

## 🎯 Endpoints at a Glance

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/quiz/start` | POST | Start new quiz |
| `/quiz/question` | GET | Get current question |
| `/quiz/answer` | POST | Submit answer |
| `/quiz/stats` | GET | Get session stats |
| `/quiz/reset` | POST | Reset quiz |

---

## ⚡ Quick Test

```bash
# Health check
curl http://localhost:5000/api/health

# Start quiz (with cookies)
curl -X POST http://localhost:5000/api/quiz/start \
  -H "Content-Type: application/json" \
  --cookie-jar cookies.txt

# Get question
curl http://localhost:5000/api/quiz/question \
  --cookie cookies.txt

# Submit answer
curl -X POST http://localhost:5000/api/quiz/answer \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{"questionId": 1, "selectedAnswer": 0}'
```

---

## 📊 Response Format

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔐 Security

- ✅ Session-based authentication
- ✅ Secure cookies (httpOnly)
- ✅ CORS protection
- ✅ Server-side validation

---

## 📚 Documentation

- **Full API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Testing Guide**: [API_TESTING.md](./API_TESTING.md)
- **Main README**: [README.md](./README.md)

---

## 🚀 Start Backend

```bash
cd backend
npm install
npm start
```

Server runs on: `http://localhost:5000`

---

## ✅ Status

| Component | Status |
|-----------|--------|
| Health Check | ✅ Working |
| Quiz Start | ✅ Working |
| Question Retrieval | ✅ Working |
| Answer Submission | ✅ Working |
| Stats Retrieval | ✅ Working |
| Quiz Reset | ✅ Working |
| Error Handling | ✅ Complete |

---

**Version**: 1.0.0 | **Status**: Production Ready ✅
