#!/usr/bin/env node

/**
 * Create Pull Request Script
 * 
 * This script creates a GitHub pull request from a feature branch to the main branch.
 * It requires a GitHub personal access token with appropriate permissions.
 * 
 * Usage:
 *   node create-pull-request.js --branch <branch-name> --title <pr-title> [--body <pr-body>]
 * 
 * Environment variables:
 *   GITHUB_TOKEN: Personal access token for GitHub API
 */

const { Octokit } = require('@octokit/rest');
const { program } = require('commander');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
program
  .requiredOption('-b, --branch <branch>', 'Feature branch name to create PR from')
  .requiredOption('-t, --title <title>', 'Pull request title')
  .option('-d, --body <body>', 'Pull request description', '')
  .option('-B, --base <base>', 'Base branch to merge into', 'main')
  .option('-r, --repo <repo>', 'GitHub repository name (owner/repo format)')
  .option('-D, --draft', 'Create as draft pull request', false)
  .parse(process.argv);

const options = program.opts();

// Clean quotes from input parameters
function cleanQuotes(str) {
  if (typeof str === 'string') {
    return str.replace(/^["']|["']$/g, '');
  }
  return str;
}

async function main() {
  try {
    // Check for GitHub token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.error('\x1b[31mError: GITHUB_TOKEN environment variable not set\x1b[0m');
      console.log('\nYou can set it by running:');
      console.log('$env:GITHUB_TOKEN = "your_github_token"');
      process.exit(1);
    }

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: token
    });

    // Determine repository info
    let owner, repo;
    
    if (options.repo) {
      // Remove any quotes that might be in the repo parameter
      const cleanRepo = cleanQuotes(options.repo);
      console.log(`Repository parameter: ${cleanRepo}`);
      
      const parts = cleanRepo.split('/');
      if (parts.length !== 2) {
        throw new Error('Repository must be in the format "owner/repo"');
      }
      
      [owner, repo] = parts;
      console.log(`Using provided repository: ${owner}/${repo}`);
    } else {
      // Get repository info from git remote
      try {
        const gitRemoteOutput = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
        console.log(`Git remote URL: ${gitRemoteOutput}`);
        
        // Handle different GitHub URL formats
        let gitRemoteMatch;
        
        // HTTPS format: https://github.com/owner/repo.git
        if (gitRemoteOutput.includes('https://')) {
          gitRemoteMatch = gitRemoteOutput.match(/github\.com\/(.+?)\/(.+?)(?:\.git)?$/);
        } 
        // SSH format: git@github.com:owner/repo.git
        else if (gitRemoteOutput.includes('@github.com')) {
          gitRemoteMatch = gitRemoteOutput.match(/github\.com:(.+?)\/(.+?)(?:\.git)?$/);
        }
        
        if (gitRemoteMatch) {
          owner = gitRemoteMatch[1];
          repo = gitRemoteMatch[2].replace('.git', '');
          console.log(`Detected owner: ${owner}`);
          console.log(`Detected repo: ${repo}`);
        } else {
          throw new Error('Could not parse GitHub repository from git remote URL');
        }
      } catch (error) {
        console.error(`\x1b[31mError: ${error.message}\x1b[0m`);
        process.exit(1);
      }
    }

    // Clean other parameters
    const title = cleanQuotes(options.title);
    const body = cleanQuotes(options.body);
    const branch = cleanQuotes(options.branch);
    const base = cleanQuotes(options.base);
    
    console.log(`Creating pull request for ${owner}/${repo}`);
    console.log(`From branch: ${branch}`);
    console.log(`To branch: ${base}`);
    console.log(`Title: ${title}`);
    
    // Create pull request
    const { data } = await octokit.pulls.create({
      owner,
      repo,
      title,
      body,
      head: branch,
      base,
      draft: options.draft
    });
    
    console.log('\x1b[32mSuccess! Pull request created:\x1b[0m');
    console.log(`Title: ${data.title}`);
    console.log(`URL: ${data.html_url}`);
    
  } catch (error) {
    let errorMessage = error.message;
    let errorDetail = '';
    
    if (error.response && error.response.data) {
      errorDetail = error.response.data.message || JSON.stringify(error.response.data);
    }
    
    console.error(`\x1b[31mError creating pull request: ${errorMessage}\x1b[0m`);
    
    if (errorDetail) {
      console.error(`\x1b[31mDetails: ${errorDetail}\x1b[0m`);
    }
    
    if (error.status === 422) {
      console.error('\x1b[31mThe pull request already exists or there is a validation error\x1b[0m');
    } else if (error.status === 404) {
      console.error('\x1b[31mRepository not found or you don\'t have access to it\x1b[0m');
      console.error('\x1b[33mTry specifying the repository explicitly:\x1b[0m');
      console.error(`node scripts/create-pull-request.js --branch "${options.branch}" --title "${options.title}" --repo "owner/repo"\x1b[0m`);
    }
    
    process.exit(1);
  }
}

main();
