# tumblr-lks-downldr
[![npm version](https://badge.fury.io/js/tumblr-lks-downldr.svg)](https://www.npmjs.com/package/tumblr-lks-downldr)

Simple node module for downloading your precious [Tumblr](https://tumblr.com) likes.

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
