$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot
$PORT = 8000

$python = (Get-Command python3 -ErrorAction SilentlyContinue)?.Source
if (-not $python) { $python = (Get-Command python -ErrorAction SilentlyContinue)?.Source }

if (-not $python) {
  Write-Host "Python not found. Please install Python 3 and try again."
  pause
  exit 1
}

$major = & $python -c "import sys; print(sys.version_info[0])"
if ($major -ne 3) {
  Write-Host "Need Python version 3. Found: $major"
  pause
  exit 1
}

Write-Host "Using $python"
Write-Host "Try Hungry Tree Friends via link http://localhost:$PORT/game"
Write-Host ""

& $python -m http.server $PORT
