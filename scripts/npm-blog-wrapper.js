#!/usr/bin/env node

/**
 * Blog Post Creation Script
 * -------------------------
 * Creates a new blog post using a template.
 * 
 * Usage:
 *   npm run new-blog-post --title="My Post" --tags="tag1,tag2"
 *   npm run new-blog-post --title="My Post" --slug="custom-slug" --tags="tag1,tag2"
 * 
 * Options:
 *   --title     Required. The title of the blog post.
 *   --slug      Optional. URL-friendly identifier. If not provided, generated from title.
 *   --tags      Optional. Comma-separated list of tags, e.g., "tech,poetry,personal"
 * 
 * For more help:
 *   npm run blog:help
 */

// This script extracts arguments from npm environment variables and passes them to create-blog-post.js
const { spawnSync } = require('child_process');
const path = require('path');

// npm sets all --key=value arguments as environment variables with prefix npm_config_
const title = process.env.npm_config_title;
const tags = process.env.npm_config_tags;

const slug = process.env.npm_config_slug;

const args = [];
if (title) args.push('--title', title);
if (tags) args.push('--tags', tags);
if (slug) args.push('--slug', slug);

// Run the blog post creator with the extracted arguments
const result = spawnSync('node', [
  path.join(__dirname, 'create-blog-post.js'),
  ...args
], { stdio: 'inherit' });

process.exit(result.status);