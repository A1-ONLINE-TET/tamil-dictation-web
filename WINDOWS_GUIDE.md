# 🖥️ Windows CMD / PowerShell Guide
# தமிழ் பயிற்சி — GitHub → Cloudflare Deploy

---

## 📋 தேவையானவை (ஒரே ஒரு முறை install)

### 1. Git Install
👉 https://git-scm.com/download/win
- Download → Install (Next Next Finish)
- PowerShell மீண்டும் திறக்கவும்

---

## 🚀 FIRST TIME SETUP (ஒரே ஒரு முறை)

### PowerShell திறக்க:
```
Windows Key → "powershell" type → Right-click → "Run as Administrator"
```

### Project folder-க்கு செல்:
```powershell
cd C:\Users\YourName\Downloads\tamil_dictation_web
```

### Script permission கொடு:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Setup இயக்கு:
```powershell
.\setup.ps1
```

Script கேட்பது:
- GitHub username → உங்கள் username போடுங்கள்
- Repository name → `tamil-dictation-web` (Enter அழுத்துங்கள்)
- Email → GitHub email போடுங்கள்
- GitHub-ல் repo create ஆனதும் Enter

---

## 📝 DAILY USE — சொற்கள் மாற்ற

### Step 1: JSON file திறந்து edit செய்
```
data\grade_3.json  →  Notepad-ல் திறந்து சொற்கள் சேர்க்கவும்
```

### Step 2: ஒரே command!
```powershell
.\push.ps1
```

அல்லது custom message-உடன்:
```powershell
.\push.ps1 -msg "3rd grade new words added"
```

### Step 3: Done! ✅
30 வினாடியில் https://tamil-dictation.pages.dev live!

---

## 📁 Folder Structure

```
tamil_dictation_web\
│
├── index.html          ← App (இதை திருத்தவேண்டாம்)
├── manifest.json       ← PWA config
├── sw.js               ← Offline support
│
├── data\               ← ✏️ இங்கே மட்டும் edit செய்யுங்கள்!
│   ├── grade_1.json    ← 1ம் வகுப்பு சொற்கள்
│   ├── grade_2.json    ← 2ம் வகுப்பு சொற்கள்
│   ├── grade_3.json    ← 3ம் வகுப்பு சொற்கள்
│   ├── grade_4.json
│   ├── grade_5.json
│   ├── grade_6.json
│   ├── grade_7.json
│   └── grade_8.json    ← 8ம் வகுப்பு சொற்கள்
│
├── setup.ps1           ← First time setup (ஒரே முறை)
└── push.ps1            ← Daily push command
```

---

## 📄 JSON Format (சொற்கள் எப்படி எழுதுவது)

```json
{
  "grade": 3,
  "tamilName": "மூன்றாம் வகுப்பு",
  "icon": "🌳",
  "lessons": [
    {
      "lessonNumber": 1,
      "title": "விலங்குகள்",
      "words": [
        { "word": "யானை",   "meaning": "பெரிய விலங்கு",    "meaningEn": "Elephant" },
        { "word": "சிங்கம்", "meaning": "காட்டின் அரசன்", "meaningEn": "Lion"     },
        { "word": "புலி",   "meaning": "கோடுகள் விலங்கு",  "meaningEn": "Tiger"   }
      ]
    },
    {
      "lessonNumber": 2,
      "title": "பழங்கள்",
      "words": [
        { "word": "மாம்பழம்",  "meaning": "மாமரத்தின் பழம்", "meaningEn": "Mango"  },
        { "word": "வாழைப்பழம்", "meaning": "வாழை பழம்",     "meaningEn": "Banana" }
      ]
    }
  ]
}
```

### விதிகள்:
- `word` → Tamil சொல் (கட்டாயம்)
- `meaning` → தமிழில் பொருள்
- `meaningEn` → English meaning (optional)
- ஒரு lesson-ல் குறைந்தது 5 சொற்கள் வேண்டும்

---

## ❓ பிரச்சினைகள்

### "git is not recognized"
→ Git install ஆகவில்லை. https://git-scm.com/download/win

### "cannot be loaded because running scripts is disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Push-ல் username/password கேட்கிறது
→ GitHub → Settings → Developer settings → Personal access tokens → Generate new token
→ Token-ஐ password-ஆக போடுங்கள்

### JSON error
→ https://jsonlint.com — JSON paste செய்து validate செய்யுங்கள்

---

## 🌐 Cloudflare Pages Setup (ஒரே ஒரு முறை)

1. https://pages.cloudflare.com → Login
2. "Create a project" → "Connect to Git"
3. GitHub → `tamil-dictation-web` repo select
4. Build settings:
   - Build command: **(காலியாக விடுங்கள்)**
   - Output directory: `/`
5. "Save and Deploy"
6. ✅ https://tamil-dictation.pages.dev Live!
