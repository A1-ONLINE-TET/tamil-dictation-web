# ═══════════════════════════════════════════════════════════
# தமிழ் பயிற்சி — First Time Setup (Windows PowerShell)
# ═══════════════════════════════════════════════════════════
# ஒரே ஒரு முறை மட்டும் இதை இயக்குங்கள்!
# பயன்படுத்த: PowerShell-ல் திறந்து:
#   .\setup.ps1
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  தமிழ் பயிற்சி — First Time Setup" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ── STEP 1: Check Git ──────────────────────────
Write-Host "1️⃣  Git சரிபார்க்கிறோம்..." -ForegroundColor Cyan
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "❌ Git install ஆகவில்லை!" -ForegroundColor Red
    Write-Host ""
    Write-Host "👇 இந்த link-ல் Git download செய்யுங்கள்:" -ForegroundColor Yellow
    Write-Host "   https://git-scm.com/download/win" -ForegroundColor White
    Write-Host ""
    Write-Host "Download → Install → PowerShell மீண்டும் திறந்து setup.ps1 இயக்குங்கள்" -ForegroundColor Yellow
    exit 1
}
$gitVersion = git --version
Write-Host "   ✅ $gitVersion" -ForegroundColor Green

# ── STEP 2: GitHub username ────────────────────
Write-Host ""
Write-Host "2️⃣  GitHub தகவல்கள்..." -ForegroundColor Cyan
$ghUser = Read-Host "   உங்கள் GitHub username"
$ghRepo = Read-Host "   Repository பெயர் (default: tamil-dictation-web)"
if ([string]::IsNullOrWhiteSpace($ghRepo)) { $ghRepo = "tamil-dictation-web" }

# ── STEP 3: Git config ────────────────────────
Write-Host ""
Write-Host "3️⃣  Git config செய்கிறோம்..." -ForegroundColor Cyan
$email = Read-Host "   உங்கள் GitHub email"
git config --global user.name  $ghUser
git config --global user.email $email
Write-Host "   ✅ Git config done" -ForegroundColor Green

# ── STEP 4: Init repo ────────────────────────
Write-Host ""
Write-Host "4️⃣  Git repository தயார் செய்கிறோம்..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    Write-Host "   ✅ Git init done" -ForegroundColor Green
} else {
    Write-Host "   ✅ Already a git repo" -ForegroundColor Green
}

# ── STEP 5: .gitignore ───────────────────────
if (-not (Test-Path ".gitignore")) {
    @"
# Windows
Thumbs.db
desktop.ini
*.lnk

# Mac
.DS_Store

# Editor
.vscode/
*.swp
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "   ✅ .gitignore உருவாக்கப்பட்டது" -ForegroundColor Green
}

# ── STEP 6: Add remote ───────────────────────
Write-Host ""
Write-Host "5️⃣  GitHub Remote connect செய்கிறோம்..." -ForegroundColor Cyan
$remoteUrl = "https://github.com/$ghUser/$ghRepo.git"

# Remove existing remote if any
git remote remove origin 2>$null

git remote add origin $remoteUrl
Write-Host "   ✅ Remote: $remoteUrl" -ForegroundColor Green

# ── STEP 7: First commit & push ──────────────
Write-Host ""
Write-Host "6️⃣  Files upload செய்கிறோம்..." -ForegroundColor Cyan
Write-Host "   (GitHub-ல் '$ghRepo' repo இல்லை என்றால் இப்போது create செய்யுங்கள்)" -ForegroundColor Yellow
Write-Host ""
Write-Host "   👉 github.com → New repository → Name: $ghRepo → Public → Create" -ForegroundColor White
Write-Host ""
Read-Host "   GitHub-ல் repo create ஆனதும் Enter அழுத்துங்கள்"

git add -A
git commit -m "Initial commit — தமிழ் எழுத்துப்பயிற்சி" 2>&1 | Out-Null

Write-Host "   ⏫ Pushing to GitHub..." -ForegroundColor Yellow
$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ GitHub-ல் upload வெற்றி!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "   ⚠️  Push issue. GitHub credentials கேட்டால் இங்கே login செய்யுங்கள்." -ForegroundColor Yellow
    Write-Host "   (Browser window திறக்கும் — GitHub login செய்யுங்கள்)" -ForegroundColor Yellow
    git push -u origin main
}

# ── DONE ────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  ✅ Setup முடிந்தது!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📌 இனி சொற்கள் மாற்றும்போது:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. data\grade_3.json திறந்து edit செய்யுங்கள்" -ForegroundColor White
Write-Host "   2. PowerShell-ல்: .\push.ps1" -ForegroundColor Yellow
Write-Host "   3. 30 வினாடியில் Live!" -ForegroundColor White
Write-Host ""
Write-Host "🔗 GitHub:     https://github.com/$ghUser/$ghRepo" -ForegroundColor Cyan
Write-Host "🌐 Live site:  https://tamil-dictation.pages.dev" -ForegroundColor Cyan
Write-Host "   (Cloudflare connect செய்தபின்)" -ForegroundColor Gray
Write-Host ""
