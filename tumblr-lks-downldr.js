#!/usr/bin/env node

'use strict';

/**
 * Node Modules
 */
var oauth = require('oauth').OAuth;
var fs = require('fs');
var http = require('http');
var stdio = require('stdio');

var ops = stdio.getopt({
    'url': {key: 'u', args: 1, description: 'What this option means', mandatory: true},
    'likesToDownload': {key: 'l', args: 1, description: 'Another description'},
    'path': {key: 'p', args: 1}
});

var tumblrLksDownldr = (function(oAuthConsumerKey, oAuthConsumerSecret) {

  var

  CONST = {
    BASE_PATH: 'http://api.tumblr.com/v2/blog/',
    REQUEST_TOKEN_URL: 'http://www.tumblr.com/oauth/request_token',
    ACCESS_TOKEN_URL: 'http://www.tumblr.com/oauth/access_token',
  },
  it = 0,
  imagesSaved = 0,
  limit = 20,
  iterations = 0,
  aux = 0,
  numberOfLikes = 0,
  numberOfImagesSavedOnCurrentIteration = 0,
  currentIteration = 0,
  limitOfCurrentIteration = 0,
  _path = '',
  _tumblrBlogURL = '',

  oa = new oauth(
    CONST.REQUEST_TOKEN_URL,
    CONST.ACCESS_TOKEN_URL,
    oAuthConsumerKey,
    oAuthConsumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
  );

  function getAndSaveImage(filename, host, path) {
    var options = {
      host: host,
      port: 80,
      path: path
    };

    http.get(options, function(res) {
      var imagedata = '';
      res.setEncoding('binary');

      res.on('data', function(chunk) {
        imagedata += chunk;
      });

      res.on('end', function() {
        fs.writeFile(_path + filename, imagedata, 'binary', function(err) {
          if (err) throw err;
          console.log(_path + filename + ' SAVED (' + (++imagesSaved) + ')');
        });
        if (++numberOfImagesSavedOnCurrentIteration === limitOfCurrentIteration && ++currentIteration < iterations) {
          numberOfImagesSavedOnCurrentIteration = 0;
          oa.getOAuthRequestToken(getOAuthRequestTokenCallback);
        }
      });
    }).on('error', function(e) {
      console.log('Got error: ' + e.message);
    });
  }

  function getOAuthAccessTokenCallback(error, oauth_access_token, oauth_access_token_secret, results2) {

    if (++aux === iterations) {
      limit = numberOfLikes % 20;
    }

    var data = '';

    oa.getProtectedResource(CONST.BASE_PATH + _tumblrBlogURL +
      '/likes?api_key=' + oAuthConsumerKey + '&offset=' + (++it * 20) +
      '&limit=' + limit,
      'GET',
      oauth_access_token,
      oauth_access_token_secret,

      function(error, data, response) {
        var liked_posts = JSON.parse(data).response.liked_posts,
        host = '',
        path = '',
        completeUrl = '',
        fileName = '';
        limitOfCurrentIteration = liked_posts.length;
        for (var i in liked_posts) {
          if (typeof liked_posts[i].photos !== 'undefined') {
            completeUrl = liked_posts[i].photos[0].original_size.url;
            host = completeUrl.split('.com')[0] + '.com';
            path = completeUrl.split('.com')[1];
            fileName = completeUrl.split('/')[completeUrl.split('/').length - 1];
            getAndSaveImage(fileName, host.replace('http://', ''), path);
          } else {
            console.log('No photos available for this post: %j', liked_posts[i].post_url);
          }
        }
      });
    }

    function getOAuthRequestTokenCallback(error, oauth_token, oauth_token_secret, results) {
      if (error) {
        console.log('error :', error);
      } else {
        oa.getOAuthAccessToken(oauth_token, oauth_token_secret, getOAuthAccessTokenCallback);
      }
    }

    function getLikes(numberOfLikes) {
      numberOfLikes = numberOfLikes;
      iterations = Math.ceil(numberOfLikes / 20);
      oa.getOAuthRequestToken(getOAuthRequestTokenCallback);
    }

    return {
      getLikes: function(tumblrUrl, pathToSave, numberOfPosts){
        console.log('Downloading from:', tumblrUrl);
        console.log('Saving posts in:', pathToSave);
        console.log('Number of post to download:', numberOfPosts);
        _path = pathToSave + '/';
        _tumblrBlogURL = tumblrUrl;
        if (fs.existsSync(_path)) {
          getLikes(numberOfPosts);
        }else{
          console.log('_path:', _path);
          fs.mkdirSync(_path);
          getLikes(numberOfPosts);
        }
      }
    };

  }
)('pXcUXQdlBndW7znq4C4vodeQg0OxCXOlXv2RamTphjNFj0MuzI', 'pKSNVyIcxqQFt4YAZdeBINkmC1s9TREcBlEJe59a9Rnla7GM7P');

tumblrLksDownldr.getLikes(
  ops.url,
  ops.path ? process.cwd() + '/' + ops.path : process.cwd(),
  ops.likesToDownload || 100
);
