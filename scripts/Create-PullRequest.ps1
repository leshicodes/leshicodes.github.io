# Create-PullRequest.ps1
# A PowerShell script to create a GitHub pull request programmatically

param (
    [Parameter(Mandatory=$true)]
    [string]$Branch,
    
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$false)]
    [string]$Body = "",
    
    [Parameter(Mandatory=$false)]
    [string]$BaseBranch = "main",
    
    [Parameter(Mandatory=$false)]
    [switch]$Draft = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$Repository
)

# Function to check if node is installed
function Test-NodeInstalled {
    try {
        $null = Get-Command node -ErrorAction Stop
        return $true
    } catch {
        Write-Error "Node.js is not installed or not in PATH. Please install Node.js before running this script."
        exit 1
    }
}

# Function to check if GITHUB_TOKEN environment variable is set
function Test-GitHubToken {
    if (-not $env:GITHUB_TOKEN) {
        Write-Warning "GITHUB_TOKEN environment variable is not set."
        Write-Host "You can set it by running: `$env:GITHUB_TOKEN = 'your_github_token'"
        $setToken = Read-Host "Would you like to set it now? (y/n)"
        
        if ($setToken -eq "y") {
            $token = Read-Host "Enter your GitHub token" -AsSecureString
            $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
            $env:GITHUB_TOKEN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
            [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
        } else {
            Write-Error "GITHUB_TOKEN is required to create a pull request."
            exit 1
        }
    }
}

# Main execution
try {
    Write-Host "Starting pull request creation process..." -ForegroundColor Cyan
    
    # Check prerequisites
    Test-NodeInstalled
    Test-GitHubToken    # Prepare arguments for the JS script
    $scriptPath = Join-Path $PSScriptRoot "create-pull-request.js"
    $arguments = @(
        $scriptPath,
        "--branch", $Branch,
        "--title", $Title,
        "--base", $BaseBranch
    )
    
    if ($Body) {
        $arguments += "--body"
        $arguments += $Body
    }
    
    if ($Draft) {
        $arguments += "--draft"
    }
    
    if ($Repository) {
        $arguments += "--repo"
        $arguments += $Repository
    }
    
    # Execute the JS script
    Write-Host "Executing: node $($arguments -join ' ')" -ForegroundColor DarkGray
    & node $arguments
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create pull request. See error message above."
    }
    
    Write-Host "Pull request creation process completed!" -ForegroundColor Green
    
} catch {
    Write-Error "An error occurred: $_"
    exit 1
}
