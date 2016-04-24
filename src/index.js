'use strict';

const http = require('http');
const pizzaGuy = require('pizza-guy');

const API_KEY = 'pXcUXQdlBndW7znq4C4vodeQg0OxCXOlXv2RamTphjNFj0MuzI';

let downloadedPosts = 0;
const imagesToDownload = [];

let postsToLoad = 0;
let tumblrBlogUrl = '';
let customPathToSave = '';
let onStartCallback = () => {};
let onFetchCallback = () => {};
let onSuccessCallback = () => {};
let onErrorCallback = () => {};

/**
 * Parse data in order to set valid global data
 * @param {Object} params object with keys
 * @returns {void}
 */
const setGlobalParams = (params) => {
  tumblrBlogUrl = params.url;
  postsToLoad = params.postsToLoad ? Number(params.postsToLoad) : postsToLoad;
  customPathToSave = params.path
    ? params.path[0] === '/'
      ? `${params.path}`
      : `${process.cwd()}/${params.path}`
    : process.cwd();

  onStartCallback = typeof params.onStart === 'function' ? params.onStart : onStartCallback;
  onFetchCallback = typeof params.onFetch === 'function' ? params.onFetch : onFetchCallback;
  onSuccessCallback = typeof params.onSuccess === 'function' ? params.onSuccess : onSuccessCallback;
  onErrorCallback = typeof params.onError === 'function' ? params.onError : onErrorCallback;
};

const downloadImages = () => {
  pizzaGuy
    .deliver(imagesToDownload)
    .onAddress(customPathToSave)
    .onSuccess((info) => {
      onSuccessCallback(info);
    })
    .onError((error, info) => {
      onErrorCallback(info);
    })
    .start();
};

/**
 * Gets liked posts from the server
 * @param  {String} timestamp used as an offset for the request
 * @return {void}
 */
const getLikedPosts = (timestamp) => {
  if (postsToLoad > 0) {
    const beforeParam = timestamp ? `&before=${timestamp}` : '';
    http.get(
      {
        host: 'api.tumblr.com',
        port: 80,
        path: `/v2/blog/${tumblrBlogUrl}/likes?api_key=${API_KEY}${beforeParam}`
      },
      (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          const _data = JSON.parse(data).response;
          let likedPosts = _data.liked_posts;
          if(likedPosts){
            const likedCount = _data.liked_count;
            const pushToArray = (photo) => {
              imagesToDownload.push(
                photo.original_size.url
              );
            };
            let lastPostTimestamp = null;

            if (postsToLoad < likedPosts.length) {
              likedPosts = likedPosts.slice(0, postsToLoad);
            }

            // This will happen just once
            if (!timestamp) {
              postsToLoad = postsToLoad
                ? postsToLoad > likedCount
                  ? likedCount
                  : postsToLoad
                : likedCount;
              onStartCallback({
                postsToLoad
              });
            }

            for (let i = 0; i < likedPosts.length; i++) {
              const currentPost = likedPosts[i];
              if (Array.isArray(currentPost.photos)) {
                currentPost.photos.forEach(pushToArray);
              }
              downloadedPosts++;
              lastPostTimestamp = likedPosts[i].timestamp;
              if (downloadedPosts === postsToLoad) {
                break;
              }
            }

            onFetchCallback({
              postsToLoad,
              downloadedPosts,
              imagesToDownload: imagesToDownload.length
            });

            if (postsToLoad === downloadedPosts) {
              downloadImages();
            } else {
              getLikedPosts(lastPostTimestamp);
            }
          } else {
            onStartCallback({
              postsToLoad: 0
            });
          }
        });
      }
    )
    .on('error', (err) => {
      if (err) {
        throw err;
      }
    });
  }
};

module.exports = {
  setGlobalParams,
  getLikedPosts
};
