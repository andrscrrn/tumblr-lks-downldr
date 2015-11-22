#!/usr/bin/env node

'use strict';

/**
 * Node Dependencies
 */
var fs = require('fs');
var os = require('os');
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
    'postsToLoad': {
      key: 'l',
      args: 1,
      description: 'Number of posts liked that you want to load and download.'
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
  DOWNLOAD_LIMIT: 20,
  PROGRESS_BAR_FORMAT: 'Downloading: [:bar] Progress: :percent Current Image: :current Estimated Time: :etas',
};

/**
 * Module Globals
 */
var tumblrBlogUrl = '';
var postsToLoad;
var customPathToSave = '';

/**
 * Vendor instances
 */
var progressBar;

/**
 * Counters
 */
var imagesDownloaded = 0;
var likedCount = 0;
var postsLoadedInMemory = 0;
var imagesThatFailed = 0;
var currentIteration = 0;

/**
 * Memory Storage
 */
var imagesToDownload = [];


/**
 * Init
 * @return {void}
 */
~function init(){

  var args;

  if(process.versions['electron']){
    return;
  }

  args = stdio.getopt(
    CONST.CLI_ARGS_CONFIG
  );

  setGlobalParams(
    {
      url: args.url,
      postsToLoad: args.postsToLoad,
      path: args.path
    }
  );

  console.log('Tumblr Blog:', tumblrBlogUrl);
	console.log('Saving in:', customPathToSave);

  getLikedPosts();
}();

/**
 * Parse data in order to set valid global data
 * @param {Object} params object with keys
 */
function setGlobalParams(params) {

  params.path = params.path.indexOf('C:\\fakepath\\') > -1
    ? params.path.replace('C:\\fakepath\\', process.env.HOME + '/')
    : params.path;
  tumblrBlogUrl = params.url;
	postsToLoad = params.postsToLoad ? Number(params.postsToLoad) : postsToLoad;
  customPathToSave = params.path
    ? params.path[0] === '/'
      ? params.path + '/'
      : process.cwd() + '/' + params.path + '/'
    : process.cwd() + '/';
}

/**
 * Gets liked posts from the server
 * @param  {String} timestamp used as an offset for the request
 * @return {void}
 */
function getLikedPosts(timestamp) {

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

        // This will happen just once
        if(!timestamp){

          postsToLoad = postsToLoad
            ? (
                postsToLoad > likedCount
                ? likedCount
                : postsToLoad
              )
            : likedCount;

          console.log('Posts to download:', postsToLoad);
          console.log('Loading images list in memory. Please wait...');
        }

        for(var i = 0; i < likedPosts.length; i++){

          lastPostTimestamp = likedPosts[i].timestamp;
          postsLoadedInMemory++;

          if(postsLoadedInMemory !== postsToLoad){
            if(likedPosts[i].photos) {
              likedPosts[i].photos.forEach(function(photo) {

                var completeUrl = photo.original_size.url;
                imagesToDownload.push(
                  {
                    'fileName': completeUrl.split('/')[completeUrl.split('/').length - 1],
                    'host': completeUrl.split('.com')[0].replace('http://', '') + '.com',
                    'path': completeUrl.split('.com')[1]
                  }
                );
                console.log(completeUrl+' ('+imagesToDownload.length+')');
              });
            }
          } else {
            console.log('Images in memory to download:', imagesToDownload.length);
            if(imagesToDownload.length){
              progressBar = new progress(
                CONST.PROGRESS_BAR_FORMAT,
                {
                  complete: '=',
                  incomplete: ' ',
                  width: 20,
                  total: imagesToDownload.length,
                  callback: exit
                }
              );

              // Creating folder if it doesn't exist before start downloading
              if (fs.existsSync(customPathToSave)){
                queueImages();
              } else {
                fs.mkdirSync(customPathToSave);
                queueImages();
              }
            } else {
              // Process exit if there are no images in memory
              exit();
            }
            break;
          }
        }

        // Requesting next group of liked posts
        if(postsLoadedInMemory !== postsToLoad){
          getLikedPosts(lastPostTimestamp);
        }
      });
    }
  )
  .on(
    'error',
    function(err) {
      if (err) {
        console.log('Failed loading images list on memory.');
        throw err;
      }
    }
  );
}

/**
 * Queues the request for each image on the current iteration
 * @return {void}
 */
function queueImages() {

  var i = currentIteration++ * CONST.DOWNLOAD_LIMIT;
  var currentLimit = CONST.DOWNLOAD_LIMIT * currentIteration;

  currentLimit = currentLimit > imagesToDownload.length
    ? imagesToDownload.length
    : currentLimit;

  for(; i < currentLimit; i++){
    downloadImage(imagesToDownload[i]);
  }
}

/**
 * Establish TCP connection for saving an image on disk
 * @param  {Object} image object containg data for the download process
 * @return {void}
 */
function downloadImage(image) {

  // Checking if image is already on disk
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
            updateProgressBar();
            nextIterationCheck();
          });
        });
      }
    )
    .on(
      'error',
      function(err) {
        if (err) {
          imagesThatFailed++;
          updateProgressBar();
          nextIterationCheck();
        }
      }
    );
  } else {
    updateProgressBar();
    nextIterationCheck();
  }
}

/**
 * Updates the progress bar component
 * @return {void}
 */
function updateProgressBar(){
  progressBar.tick(1);
  imagesDownloaded++;
  nextIterationCheck();
}

/**
 * Check if the next iteration is already needed
 * @return {void}
 */
function nextIterationCheck() {

  // Starting the download process again each time we reach current iteration limit
  if(imagesDownloaded % CONST.DOWNLOAD_LIMIT === 0){
    queueImages();
  }
}

/**
 * Stop and exit the whole process
 * @return {void}
 */
function exit() {

  console.log('Images saved in:', customPathToSave);
  console.log('Images that failed:', imagesThatFailed);
  console.log('Done.');

  process.exit();
}

exports.setGlobalParams = setGlobalParams;
exports.getLikedPosts = getLikedPosts;
