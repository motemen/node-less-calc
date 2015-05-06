#!/usr/bin/env node

'use strict';

var less = require('less');

var input = process.argv[2];

if (typeof input === 'undefined' || input === '--help' || input === '-h') {
  var usage = [
    'Usage: less-calc <expr>',
    '',
    'Evaluates Less <http://lesscss.org/> expression. For more information, visit the docs site.'
  ];

  usage.forEach(function (line) {
    console.log(line);
  });
  process.exit(0);
}

less.parse('* { x: ' + input + '}').then(
  function (root) {
    var gen = less.transformTree(root);
    var ruleset = gen.rules[0];     // * { ... }
    var rule    = ruleset.rules[0]; // x: ...
    var value   = rule.value;

    if (value.genCSS) {
      var out = [];
      value.genCSS(gen, {
        add: function (chunk) {
          out.push(chunk);
        },
        isEmpty: function () {
          return out.length === 0;
        }
      });
      return out.join('');
    } else {
      throw 'Could not evaluate to color:' + value;
    }
  }
).then(
  function (result) {
    console.log(result);
  },
  function (err) {
    console.error(err);
    process.exit(1);
  }
);
