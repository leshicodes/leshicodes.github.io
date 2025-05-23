# GitHub Pull Request Scripts

This directory contains scripts to help manage Git branches and create pull requests programmatically.

## Create Pull Request

The `Create-PullRequest.ps1` script allows you to create a pull request from a feature branch to the main branch using GitHub's API.

### Prerequisites

1. Install Node.js if you haven't already
2. Set up a GitHub Personal Access Token (PAT):
   - Visit https://github.com/settings/tokens
   - Create a token with `repo` scope permissions
   - Save the token securely

### Usage

#### Using PowerShell:

```powershell
# Set your GitHub token (only needs to be done once per PowerShell session)
$env:GITHUB_TOKEN = "your_github_personal_access_token"

# Basic usage
.\scripts\Create-PullRequest.ps1 -Branch feature-branch -Title "Add new feature"

# With optional parameters
.\scripts\Create-PullRequest.ps1 -Branch feature-branch -Title "Add new feature" -Body "This PR adds a new feature" -BaseBranch main -Draft

# If repository auto-detection fails, specify it explicitly
.\scripts\Create-PullRequest.ps1 -Branch feature-branch -Title "Add new feature" -Repository username/repo-name
```

#### Using npm:

```powershell
# Basic usage
npm run create-pr -- -Branch "feature-branch" -Title "Add new feature"

# With optional parameters
npm run create-pr -- -Branch "feature-branch" -Title "Add new feature" -Body "This PR adds a new feature" -BaseBranch "main" -Draft
```

### Parameters

- `-Branch`: (Required) The name of the feature branch to create PR from
- `-Title`: (Required) The title of the pull request  
- `-Body`: (Optional) The description of the pull request
- `-BaseBranch`: (Optional) The target branch to merge into (default: "main")
- `-Draft`: (Optional) Create as draft pull request
- `-Repository`: (Optional) The GitHub repository in format "owner/repo" (used if auto-detection fails)

### Environment Variables

- `GITHUB_TOKEN`: GitHub Personal Access Token with repo access

## Merge Branches

The `Merge-Branches.ps1` script allows you to merge one branch into another.

### Usage

```powershell
# Basic usage
.\scripts\Merge-Branches.ps1 -sourceBranch "feature-branch" -targetBranch "main"

# With optional parameters
.\scripts\Merge-Branches.ps1 -sourceBranch "feature-branch" -targetBranch "main" -push -noPull
```

### Parameters

- `-sourceBranch`: (Required) Branch to merge from
- `-targetBranch`: (Required) Branch to merge into
- `-push`: (Optional) Push changes to remote after merge
- `-noPull`: (Optional) Skip pulling latest changes
