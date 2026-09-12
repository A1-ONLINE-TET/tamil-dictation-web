# ═══════════════════════════════════════════════════════════
# தமிழ் பயிற்சி — GitHub Push Script (Windows PowerShell)
# ═══════════════════════════════════════════════════════════
# பயன்படுத்த: PowerShell-ல் திறந்து இந்த command போடுங்கள்:
#   .\push.ps1
# ═══════════════════════════════════════════════════════════

param(
    [string]$msg = "Update words"
)

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  தமிழ் பயிற்சி — Cloudflare Deploy" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git install ஆகவில்லை!" -ForegroundColor Red
    Write-Host "   https://git-scm.com/download/win — இதில் download செய்யுங்கள்" -ForegroundColor Yellow
    exit 1
}

# Check we are in a git repo
if (-not (Test-Path ".git")) {
    Write-Host "❌ இது git repo இல்லை!" -ForegroundColor Red
    Write-Host "   முதலில் setup.ps1 இயக்குங்கள்" -ForegroundColor Yellow
    exit 1
}

# Show changed files
Write-Host "📁 மாற்றப்பட்ட files:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Stage all changes
git add -A

# Commit with message
$commitMsg = if ($args.Count -gt 0) { $args[0] } else { $msg }
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "$commitMsg [$timestamp]" 2>&1 | Out-Null

# Push to GitHub
Write-Host "⏫ GitHub-க்கு upload செய்கிறோம்..." -ForegroundColor Yellow
$pushResult = git push 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ வெற்றி! GitHub-ல் upload ஆனது" -ForegroundColor Green
    Write-Host "⏳ Cloudflare 30 வினாடியில் auto deploy செய்யும்..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🌐 உங்கள் site: https://tamil-dictation.pages.dev" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push தோல்வி!" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    Write-Host ""
    Write-Host "தீர்வு: setup.ps1 மீண்டும் இயக்கி பாருங்கள்" -ForegroundColor Yellow
    exit 1
}
