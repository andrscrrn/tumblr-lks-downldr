'use strict';

module.exports = {
  'rules': {
    'quotes': [2, 'single'],
    'no-nested-ternary': [1],
    'max-statements': [1]
  },
  'globals': {
    'define': false,
    'describe': false,
    'it': false,
    'module': false,
    'require': false
  },
  'extends': 'defaults/configurations/walmart/es6-node'
};
