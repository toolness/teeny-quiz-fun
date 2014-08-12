#! /usr/bin/env node

var fs = require('fs');

var BASE_URL = process.argv[2] ||
               'http://toolness.github.io/teeny-quiz-fun/';

var content = fs.readFileSync(__dirname + '/../index.html', 'utf-8');

content = content
  .replace('href="teeny-quiz.css"',
           'href="' + BASE_URL + 'teeny-quiz.css"')
  .replace('src="teeny-quiz.js"',
           'src="' + BASE_URL + 'teeny-quiz.js"');

process.stdout.write(content);
