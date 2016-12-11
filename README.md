# tumblr-lks-downldr
[![Travis](https://img.shields.io/travis/andrscrrn/tumblr-lks-downldr.svg?style=flat-square)](https://travis-ci.org/andrscrrn/tumblr-lks-downldr)
[![Codecov](https://img.shields.io/codecov/c/github/andrscrrn/tumblr-lks-downldr.svg?style=flat-square)](https://codecov.io/github/andrscrrn/tumblr-lks-downldr)
[![NPM](https://img.shields.io/npm/v/tumblr-lks-downldr.svg?style=flat-square)](https://www.npmjs.com/package/tumblr-lks-downldr)
[![Downloads Total](https://img.shields.io/npm/dt/tumblr-lks-downldr.svg?style=flat-square)](https://www.npmjs.com/package/tumblr-lks-downldr)
[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Semantic Released](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Simple node module for downloading your precious [Tumblr](https://tumblr.com) likes.

A few things for having in mind while using it:
* This will save ***just image files*** and not any other kind of content.
* Images are saved with the filenames given by Tumblr unless the `attribution` parameter is set to true (see below).
* The number of `postsToLoad` it likely ***NOT*** going to be the same as the number of images that you will get. Posts can have more than one image or not having any image ***AT ALL***.
* The maximum value for postsOffset is 1000 (this is [a limitation of the Tumblr API](https://www.tumblr.com/docs/en/api/v2#blog-likes)).
* If the `attribution` parameter is set to true, images will be renamed in the form "{blogname}_{timestamp}" and a .txt file with the like's textual content will be created using the same name (i.e. 'blogpost_123456_0.jpg' will have its note saved as 'blogpost_123456.txt').
* The `postsToLoad` parameter will work for the latests post. For example: If you set a limit of 100, you'll get the latest 100 posts from you account. This can be useful if you already ran the utility before and your intention is just to update the folder with the latests posts.

## How to use

Install the module as a dependency in your project:
```
npm i tumblr-lks-downldr --save
```

Require it into your project:
```javascript
const tumblrLksDownldr = require('tumblr-lks-downldr');
```

Then you can interact with it using the `setGlobalParams` and `getLikedPosts` methods:
```javascript
tumblrLksDownldr.setGlobalParams(
  {
    url: 'yourblog.tumblr.com',
    postsToLoad: '10',
    postsOffset: '10',
    attribution: true,
    path: 'some-path-you-want',
    onStart: (info) => {
      console.log('onStart:', info);
    },
    onFetch: (info) => {
      console.log('onFetch:', info);
    },
    onDownloadStart: (info) => {
      console.log('Download start:', info);
    },
    onSuccess: (info) => {
      console.log(`${info.fileName} succeed!`);
    },
    onError: (error, info) => {
      console.log(`${info.fileName} failed!`);
    },
    onComplete: () => {
      console.log('Complete!');
    }
  }
);
tumblrLksDownldr.getLikedPosts();
```
## I want a functionality that is not supported. What can I do?
Well, you can ask for it as an issue and depending on my available time, I can see how feasible it is. At that point the idea can be added as a To-Do itemor just get closed if it is not following our expectations with the module.

## Do I really need to create a javascript file to use this?
Yes and no. For this specific module yes but if you want to use it as a CLI tool you can use [tumblr-lks-downldr-cli](https://github.com/andrscrrn/tumblr-lks-downldr-cli) that is basically a wrapper.

## Issues
I'm working on this module once on a while but if you find out any issue please report it [here](https://github.com/andrscrrn/tumblr-lks-downldr/issues).
