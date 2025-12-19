# PowerShell script to update .env with Atlas connection string
Write-Host "MongoDB Atlas Setup" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please provide your Atlas connection details:" -ForegroundColor Yellow
Write-Host ""

$username = Read-Host "Enter your Atlas username"
$password = Read-Host "Enter your Atlas password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
$cluster = Read-Host "Enter your cluster name (e.g., cluster0.xxxxx)"

# URL encode password (basic encoding for common special chars)
$passwordEncoded = [System.Web.HttpUtility]::UrlEncode($passwordPlain)

$atlasUri = "mongodb+srv://${username}:${passwordEncoded}@${cluster}.mongodb.net/bookmyshow?retryWrites=true&w=majority"

Write-Host ""
Write-Host "Your Atlas connection string:" -ForegroundColor Green
Write-Host $atlasUri -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Update .env file with this connection string? (y/n)"
if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    # Read existing .env
    $envContent = Get-Content .env -ErrorAction SilentlyContinue
    
    # Update MONGODB_URI
    $newContent = $envContent | ForEach-Object {
        if ($_ -match "^MONGODB_URI=") {
            "MONGODB_URI=$atlasUri"
        } else {
            $_
        }
    }
    
    # If MONGODB_URI doesn't exist, add it
    if (-not ($envContent -match "^MONGODB_URI=")) {
        $newContent += "MONGODB_URI=$atlasUri"
    }
    
    $newContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file updated successfully!" -ForegroundColor Green
} else {
    Write-Host "Update cancelled. Copy this connection string manually:" -ForegroundColor Yellow
    Write-Host $atlasUri -ForegroundColor White
}

