#!/usr/bin/env node

'use strict';

/**
 * Node Dependencies
 */
var oauth = require('oauth').OAuth;
var fs = require('fs');
var http = require('http');
var stdio = require('stdio');

/**
 * Constants
 */
var CONST = {
  CLI_ARGS_CONFIG: {
    'url': {
      key: 'u',
      args: 1,
      description: 'Valid Tumblr URL.',
      mandatory: true
    },
    'likesToDownload': {
      key: 'l',
      args: 1,
      description: 'Number of likes that you want to download.',
      mandatory: true
    },
    'path': {
      key: 'p',
      args: 1,
      description: 'Relative path to save the images.'
    }
  },
  BASE_PATH: 'http://api.tumblr.com/v2/blog/',
  REQUEST_TOKEN_URL: 'http://www.tumblr.com/oauth/request_token',
  ACCESS_TOKEN_URL: 'http://www.tumblr.com/oauth/access_token',
  OAUTH_CONSUMER_KEY: 'pXcUXQdlBndW7znq4C4vodeQg0OxCXOlXv2RamTphjNFj0MuzI',
  OAUTH_CONSUMER_SECRET: 'pKSNVyIcxqQFt4YAZdeBINkmC1s9TREcBlEJe59a9Rnla7GM7P',
  ITERATION_LIMIT: 20
};

/**
 * Module Globals
 */
var url = '';
var likesToDownload = '';
var customPath = '';
var oa = null;
var iterations = 0;
var aux = 0;
var it = 0;
var limitOfCurrentIteration = 0;
var numberOfImagesSavedOnCurrentIteration = 0;
var imagesSaved = 0;
var currentIteration = 0;
var postNumber = 0;

/**
 * Init
 * @return {void}
 */
~function init(){

  var args = stdio.getopt(
    CONST.CLI_ARGS_CONFIG
  );

  oa = new oauth(
    CONST.REQUEST_TOKEN_URL,
    CONST.ACCESS_TOKEN_URL,
    CONST.OAUTH_CONSUMER_KEY,
    CONST.OAUTH_CONSUMER_SECRET,
    '1.0',
    null,
    'HMAC-SHA1'
  );

	url = args.url;
	likesToDownload = args.likesToDownload;
	customPath = args.path ? process.cwd() + '/' + args.path : process.cwd() + '/';

	console.log('Downloading from:', url);
	console.log('Number of posts to download:', likesToDownload);
	console.log('Saving posts in:', customPath);
  console.log('Starting process...');

  if (fs.existsSync(customPath)){
    getLikes();
  } else {
    fs.mkdirSync(customPath);
    getLikes();
  }
}();

function getLikes() {
	iterations = Math.ceil(likesToDownload / CONST.ITERATION_LIMIT);
	oa.getOAuthRequestToken(getOAuthRequestTokenCallback);
}

function getOAuthRequestTokenCallback(err, oauth_token, oauth_token_secret, results) {
  if (err) throw err;
  oa.getOAuthAccessToken(oauth_token, oauth_token_secret, getOAuthAccessTokenCallback);
}

function getOAuthAccessTokenCallback(error, oauth_access_token, oauth_access_token_secret, results2){

  var data = '';

  if (++aux === iterations) {
    CONST.ITERATION_LIMIT = likesToDownload % CONST.ITERATION_LIMIT;
  }

  oa.getProtectedResource(
    CONST.BASE_PATH + url +'/likes?api_key=' + CONST.OAUTH_CONSUMER_KEY + '&offset=' + (++it * CONST.ITERATION_LIMIT) + '&limit=' + CONST.ITERATION_LIMIT,
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
      for (var i = 0; i < liked_posts.length; i++) {
        if (typeof liked_posts[i].photos !== 'undefined') {
          completeUrl = liked_posts[i].photos[0].original_size.url;
          host = completeUrl.split('.com')[0] + '.com';
          path = completeUrl.split('.com')[1];
          fileName = completeUrl.split('/')[completeUrl.split('/').length - 1];
          if (!fs.existsSync(customPath + fileName)) {
            getAndSaveImage(fileName, host.replace('http://', ''), path);
          }else{
            console.log(fileName, 'already exists.');
            checkIfNewIterationNeeded();
          }
        } else {
          console.log('No photos available for this post: %j', liked_posts[i].post_url);
          checkIfNewIterationNeeded();
        }
      }
    }
  );
}

function getAndSaveImage(filename, host, path) {
  http.get(
    {
      host: host,
      port: 80,
      path: path
    },
    function(response) {
      var imagedata = '';
      response.setEncoding('binary');

      response.on('data', function(chunk) {
        imagedata += chunk;
      });

      response.on('end', function() {
        fs.writeFile(customPath + filename, imagedata, 'binary', function(err) {
          if (err) throw err;
          console.log(filename + ' SAVED (' + (++imagesSaved) + ')');
        });
        checkIfNewIterationNeeded();
      });
    }
  )
  .on(
    'error',
    function(err) {
      if (err) throw err;
    }
  );
}

function checkIfNewIterationNeeded(){
  if (++numberOfImagesSavedOnCurrentIteration === limitOfCurrentIteration && ++currentIteration < iterations) {
    numberOfImagesSavedOnCurrentIteration = 0;
    oa.getOAuthRequestToken(getOAuthRequestTokenCallback);
  }
}
