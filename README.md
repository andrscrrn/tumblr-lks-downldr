# tumblr-lks-downldr
[![NPM](https://img.shields.io/npm/v/tumblr-lks-downldr.svg?style=flat-square)](https://www.npmjs.com/package/tumblr-lks-downldr)
[![Downloads Total](https://img.shields.io/npm/dt/tumblr-lks-downldr.svg?style=flat-square)](https://www.npmjs.com/package/tumblr-lks-downldr)
[![Downloads Monthly](https://img.shields.io/npm/dm/tumblr-lks-downldr.svg?style=flat-square)](https://www.npmjs.com/package/tumblr-lks-downldr)
[![Travis](https://img.shields.io/travis/andresdavid90/tumblr-lks-downldr.svg?style=flat-square)](https://travis-ci.org/andresdavid90/tumblr-lks-downldr)
[![Codecov](https://img.shields.io/codecov/c/github/andresdavid90/tumblr-lks-downldr.svg?style=flat-square)](https://codecov.io/github/andresdavid90/tumblr-lks-downldr)
[![GitHub license](https://img.shields.io/github/license/andresdavid90/tumblr-lks-downldr.svg?style=flat-square)](https://github.com/andresdavid90/tumblr-lks-downldr)

Simple node module for downloading your precious [Tumblr](https://tumblr.com) likes. The code still suck but I'm working on it.

## How to use

Install the module as a dependency:
```
npm i tumblr-lks-downldr --save
```

Require it into your project:
```
var tumblrLksDownldr = require('tumblr-lks-downldr');
```

Then you can interact with it using the `setGlobalParams` and `getLikedPosts` methods:
```
tumblrLksDownldr.setGlobalParams(
  {
    url: 'yourblog.tumblr.com',
    postsToLoad: '10',
    path: 'some-path-you-want'
  }
);
tumblrLksDownldr.getLikedPosts();
```
## What happened with the CLI?
I just moved it to his own module  [tumblr-lks-downldr-cli](https://github.com/andresdavid90/tumblr-lks-downldr-cli) so it's easier to maintain.

## Issues

I'm working on this module once on a while but if you find out any issue please report it [here](https://github.com/andresdavid90/tumblr-lks-downldr/issues).
