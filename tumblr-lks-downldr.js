#!/usr/bin/env node

'use strict';

/**
 * Node Dependencies
 */
var fs = require('fs');
var http = require('http');
var stdio = require('stdio');
var progress = require('progress');

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
    'postsToDownload': {
      key: 'l',
      args: 1,
      description: 'Number of posts liked that you want to download.'
    },
    'path': {
      key: 'p',
      args: 1,
      description: 'Relative path to save the images.'
    }
  },
  API_URL: 'api.tumblr.com',
  API_PORT: 80,
  API_PATH: '/v2/blog/{{blog-url}}/likes?api_key={{api-key}}{{before-param}}',
  API_KEY: 'pXcUXQdlBndW7znq4C4vodeQg0OxCXOlXv2RamTphjNFj0MuzI',
  DOWNLOAD_LIMIT: 20
};

/**
 * Module Globals
 */
var tumblrBlogUrl = '';
var postsToDownload;
var customPathToSave = '';
var filesDownloaded = 0;
var likedCount = 0;
var imagesDownloadedProgressBar;
var imagesList = [];
var postsDownloaded = 0;
var imagesThatFailed = 0;
var currentIteration = 0;

/**
 * Init
 * @return {void}
 */
~function init(){

  var args = stdio.getopt(
    CONST.CLI_ARGS_CONFIG
  );

	tumblrBlogUrl = args.url;
	postsToDownload = args.postsToDownload ? Number(args.postsToDownload) : postsToDownload;
	customPathToSave = args.path ? process.cwd() + '/' + args.path : process.cwd() + '/';

  console.log('Tumblr Blog:', tumblrBlogUrl);
	console.log('Saving in:', customPathToSave);

  if (fs.existsSync(customPathToSave)){
    getLikesFromServer();
  } else {
    fs.mkdirSync(customPathToSave);
    getLikesFromServer();
  }
}();

function getLikesFromServer(timestamp) {

  http.get(
    {
      host: CONST.API_URL,
      port: CONST.API_PORT,
      path: CONST.API_PATH
        .replace('{{blog-url}}', tumblrBlogUrl)
        .replace('{{api-key}}', CONST.API_KEY)
        .replace('{{before-param}}', timestamp ? '&before='+timestamp : '')
    },
    function(response) {

      var data = '';

      response.on('data', function(d) {
          data += d;
      });

      response.on('end', function() {

        var response = JSON.parse(data).response;
        var likedPosts = response.liked_posts;
        var lastPostTimestamp = null;

        likedCount = response.liked_count;

        if(!timestamp){

          postsToDownload = postsToDownload
            ? (
                postsToDownload > likedCount
                ? likedCount
                : postsToDownload
              )
            : likedCount;

          console.log('Posts to download:', postsToDownload);
          console.log('Loading images list on memory. Please wait...');
        }

        for(var i = 0; i < likedPosts.length; i++){
          lastPostTimestamp = likedPosts[i].timestamp;
          postsDownloaded++;
          if(postsDownloaded !== postsToDownload){
            if(likedPosts[i].photos) {
              likedPosts[i].photos.forEach(function(photo) {
                var completeUrl = photo.original_size.url;
                imagesList.push(
                  {
                    'fileName': completeUrl.split('/')[completeUrl.split('/').length - 1],
                    'host': completeUrl.split('.com')[0].replace('http://', '') + '.com',
                    'path': completeUrl.split('.com')[1]
                  }
                );
                console.log(completeUrl+' ('+imagesList.length+')');
              });
            }
          } else {
            console.log('Images to download:', imagesList.length);
            if(imagesList.length){
              imagesDownloadedProgressBar = new progress(
                'Downloading: [:bar] Progress: :percent Current Image: :current Estimated Time: :etas',
                {
                  complete: '=',
                  incomplete: ' ',
                  width: 20,
                  total: imagesList.length,
                  callback: exit
                }
              );
              downloadImages(imagesList);
            } else {
              exit();
            }
            break;
          }
        }
        if(postsDownloaded !== postsToDownload){
          getLikesFromServer(lastPostTimestamp);
        }
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

function downloadImages(images) {
  var i = currentIteration++ * CONST.DOWNLOAD_LIMIT;
  var e = CONST.DOWNLOAD_LIMIT * currentIteration;
  e = e > imagesList.length ? imagesList.length : e;
  for(; i < e; i++){
    getAndSaveImage(images[i]);
  }
}

function getAndSaveImage(image) {
  if (!fs.existsSync(customPathToSave + image.fileName)) {
    http.get(
      {
        host: image.host,
        port: 80,
        path: image.path
      },
      function(response) {
        var imagedata = '';
        response.setEncoding('binary');

        response.on('data', function(chunk) {
          imagedata += chunk;
        });

        response.on('end', function() {
          fs.writeFile(customPathToSave + image.fileName, imagedata, 'binary', function(err) {
            if (err) throw err;
            updateImagesDownloadedProgressBar();
          });
        });
      }
    )
    .on(
      'error',
      function(err) {
        if (err) {
          imagesThatFailed++;
          updateImagesDownloadedProgressBar();
        }
      }
    );
  } else {
    updateImagesDownloadedProgressBar();
  }
}

function updateImagesDownloadedProgressBar(){
  imagesDownloadedProgressBar.tick(1);
  filesDownloaded++;
  if(filesDownloaded % CONST.DOWNLOAD_LIMIT === 0){
    downloadImages(imagesList);
  }
}

function exit() {
  console.log('Images that failed:', imagesThatFailed);
  console.log('Done.');
  process.exit();
}
