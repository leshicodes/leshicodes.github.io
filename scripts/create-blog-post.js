#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const readline = require('readline');

program
  .arguments('[args...]') // Add this line to accept positional arguments
  .option('-t, --title <title>', 'Blog post title')
  .option('-s, --slug <slug>', 'URL slug (optional)')
  .option('-g, --tags <tags>', 'Comma-separated tags')
  .allowUnknownOption() // Add this to be more forgiving with argument parsing
  .version('1.0.0')
  .addHelpText('after', `
Examples:
  $ npm run new-blog-post -- --title="My Post" --tags="tag1,tag2"
  $ npm run new-blog-post -- --title="My Post" --slug="custom-slug" --tags="tag1,tag2"
  $ node scripts/create-blog-post.js --title "My Post" --tags "tag1,tag2"
  `)
  .parse(process.argv);

const options = program.opts();

// Handle npm run arguments with equals signs
if (process.argv.some(arg => arg.startsWith('--title='))) {
  const titleArg = process.argv.find(arg => arg.startsWith('--title='));
  options.title = titleArg.split('=')[1].replace(/^"|"$/g, '');
  
  const tagsArg = process.argv.find(arg => arg.startsWith('--tags='));
  if (tagsArg) {
    options.tags = tagsArg.split('=')[1].replace(/^"|"$/g, '');
  }
}

console.log('Processed options:', options);

// Debugging... remove later.
console.log('Command line arguments:', process.argv);
console.log('Parsed options:', options);

// Get the template content
const templatePath = path.join(__dirname, '..', 'blog', 'templates', 'YYYY-mm-dd-blog-post-title.mdx.template');
const template = fs.readFileSync(templatePath, 'utf8');

// If all options are provided via command line, generate the post directly
if (options.title) {
  generateBlogPost(options);
} else {
  // Otherwise, prompt for missing details
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('📝 Create a new blog post');
  console.log('------------------------');
  
  const answers = {};
  
  rl.question('Blog post title: ', (title) => {
    answers.title = title;
    
    rl.question('URL slug (leave empty to generate from title): ', (slug) => {
      answers.slug = slug;
      
      rl.question('Tags (comma-separated, e.g. tech,poetry,personal): ', (tags) => {
        answers.tags = tags;
        rl.close();
        
        generateBlogPost(answers);
      });
    });
  });
}

function generateBlogPost(data) {
  // Generate filename with current date
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Generate slug if not provided
  if (!data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  }
  
  // Format tags as an array
  const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : ['docusaurus'];
  const formattedTags = JSON.stringify(tags).replace(/"/g, '');
  
  // Replace placeholders in the template
  let content = template
    .replace('slug: blog-post-title', `slug: ${data.slug}`)
    .replace('title: Blog post title', `title: ${data.title}`)
    .replace('tags: [docusaurus]', `tags: ${formattedTags}`);
    
  // Generate the file path
  const fileName = `${dateStr}-${data.slug}.mdx`;
  const filePath = path.join(__dirname, '..', 'blog', fileName);
  
  // Write the file
  fs.writeFileSync(filePath, content);
  
  console.log(`✅ Blog post created at: ${filePath}`);
}