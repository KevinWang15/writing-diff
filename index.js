#!/usr/bin/env node

const fs = require('fs');
const spawn = require('cross-spawn');
const beforeFile = process.argv[2];
const afterFile = process.argv[3];
const Convert = require('ansi-to-html');
const open = require("open");

const ensureFileExists = require('./utils/ensureFileExists');
const convert = new Convert();
const template = fs.readFileSync(__dirname + '/template.html', { encoding: 'utf8' });

// sanity checks
if (!afterFile || !beforeFile) {
  console.log("Usage: writing-diff before.txt after.txt");
  process.exit(-1);
}
ensureFileExists(afterFile);
ensureFileExists(beforeFile);

// execute git diff and convert the output to html
var html = convert.toHtml(
  spawn.sync("git", ["diff", "--color-words", "--no-index", afterFile, beforeFile]).stdout.toString('utf8')
);

// add css classes
html = html.replace(/style="color:#A00"/g, 'class="deletion"');
html = html.replace(/style="color:#0A0"/g, 'class="addition"');

// fix whitespaces
html = html.replace(/<\/span><span/g, '</span> <span');
html = html.replace(/(\w)<span/g, '$1 <span');
html = html.replace(/<\/span>(\w)/g, '</span> $1');

// use the template
html = template.replace(/\[\[TEXT]]/, html);

// output and open file
var htmlPath = __dirname + '/output/' + (new Date()).toISOString().replace(/[^0-9]/g, "") + '.html';
fs.writeFileSync(htmlPath, html, { encoding: 'utf8' });
open(htmlPath);