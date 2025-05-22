param (
    [Parameter(Mandatory=$true)]
    [string]$sourceBranch,
    
    [Parameter(Mandatory=$true)]
    [string]$targetBranch,
    
    [Parameter(Mandatory=$false)]
    [switch]$push = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$noPull = $false
)

# Function to check if git is installed
function Test-GitInstalled {
    try {
        $null = Get-Command git -ErrorAction Stop
        return $true
    } catch {
        Write-Error "Git is not installed or not in PATH. Please install Git before running this script."
        exit 1
    }
}

# Function to check if we're in a git repository
function Test-GitRepository {
    $gitDir = git rev-parse --git-dir 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Current directory is not a git repository."
        exit 1
    }
}

# Function to check if branches exist
function Test-BranchExists {
    param (
        [string]$branch
    )
    
    $branchExists = git show-ref --verify --quiet "refs/heads/$branch"
    if ($LASTEXITCODE -ne 0) {
        $remoteBranchExists = git ls-remote --heads origin $branch
        if ($remoteBranchExists) {
            Write-Host "Branch '$branch' exists only remotely. Creating local tracking branch..."
            git branch --track $branch "origin/$branch"
            return $true
        }
        Write-Error "Branch '$branch' does not exist locally or remotely."
        return $false
    }
    return $true
}

# Main execution
try {
    Write-Host "Starting merge process: $sourceBranch → $targetBranch"
    
    # Check prerequisites
    Test-GitInstalled
    Test-GitRepository
    
    # Ensure both branches exist
    if (-not (Test-BranchExists -branch $sourceBranch) -or -not (Test-BranchExists -branch $targetBranch)) {
        exit 1
    }
    
    # Save current branch to return to it later
    $currentBranch = git symbolic-ref --short HEAD
    Write-Host "Current branch is: $currentBranch"
    
    # Step 1: Update source branch if needed
    if (-not $noPull) {
        Write-Host "Updating source branch: $sourceBranch"
        git checkout $sourceBranch
        git pull origin $sourceBranch
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to update source branch $sourceBranch"
        }
    }
    
    # Step 2: Update target branch
    Write-Host "Updating target branch: $targetBranch"
    git checkout $targetBranch
    if (-not $noPull) {
        git pull origin $targetBranch
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to update target branch $targetBranch"
        }
    }
    
    # Step 3: Merge source into target
    Write-Host "Merging $sourceBranch into $targetBranch..."
    git merge $sourceBranch --no-ff -m "Merge $sourceBranch into $targetBranch"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Merge conflict occurred. Please resolve conflicts manually."
        Write-Host "After resolving conflicts, complete the merge with 'git merge --continue'"
        Write-Host "Or abort the merge with 'git merge --abort'"
        exit 1
    } else {
        Write-Host "Merge completed successfully!" -ForegroundColor Green
    }
    
    # Step 4: Push changes if requested
    if ($push) {
        Write-Host "Pushing changes to remote..."
        git push origin $targetBranch
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to push changes to remote"
        }
        Write-Host "Changes pushed to remote successfully!" -ForegroundColor Green
    }
    
    # Return to the original branch
    Write-Host "Switching back to $currentBranch"
    git checkout $currentBranch
    
    Write-Host "Merge process completed!" -ForegroundColor Green
} catch {
    Write-Error "An error occurred: $_"
    exit 1
}