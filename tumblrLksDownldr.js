/**
 * This is a singleton type object that allow users to download their Tumblr likes.
 * @param  {string} tumblrBlogURL
 * @param  {string} oAuthConsumerKey
 * @param  {string} oAuthConsumerSecret
 * @param  {string} relativePathToSaveImages
 */
var TumblrLksDownldr = (function(tumblrBlogURL, oAuthConsumerKey, oAuthConsumerSecret, relativePathToSaveImages) {

    // Requiring Node Modules
    var util = require('util'),
        OAuth = require('oauth').OAuth,
        fs = require('fs'),
        http = require('http'),

        // Constant URLs
        BASE_PATH = 'http://api.tumblr.com/v2/blog/',
        REQUEST_TOKEN_URL = 'http://www.tumblr.com/oauth/request_token',
        ACCESS_TOKEN_URL = 'http://www.tumblr.com/oauth/access_token',

        // Private Variables
        it = 0,
        imagesSaved = 0,
        limit = 20,
        iterations = 0,
        aux = 0,
        numberOfLikes = 0,
        numberOfImagesSavedOnCurrentIteration = 0,
        currentIteration = 0,
        limitOfCurrentIteration = 0,

        // Creating the OAuth object with given parameters
        oa = new OAuth(REQUEST_TOKEN_URL,
            ACCESS_TOKEN_URL,
            oAuthConsumerKey,
            oAuthConsumerSecret,
            "1.0",
            null,
            "HMAC-SHA1");

    /**
     * [getAndSaveImage description]
     * @param  {[type]} filename
     * @param  {[type]} host
     * @param  {[type]} path
     * @return {[type]}
     */
    function getAndSaveImage(filename, host, path) {
        var fn = filename,
            options = {
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
                fs.writeFile(relativePathToSaveImages + fn, imagedata, 'binary', function(err) {
                    if (err) throw err;
                    util.puts(fn + ' SAVED (' + (++imagesSaved) + ')');
                });
                if (++numberOfImagesSavedOnCurrentIteration === limitOfCurrentIteration && ++currentIteration < iterations) {
                    numberOfImagesSavedOnCurrentIteration = 0;
                    oa.getOAuthRequestToken(getOAuthRequestTokenCallback);
                }
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }

    /**
     * [getOAuthAccessTokenCallback description]
     * @param  {[type]} error
     * @param  {[type]} oauth_access_token
     * @param  {[type]} oauth_access_token_secret
     * @param  {[type]} results2
     * @return {[type]}
     */
    function getOAuthAccessTokenCallback(error, oauth_access_token, oauth_access_token_secret, results2) {

        if (++aux === iterations) {
            limit = numberOfLikes % 20;
        }

        var data = "";

        oa.getProtectedResource(BASE_PATH + tumblrBlogURL +
            "/likes?api_key=" + oAuthConsumerKey + "&offset=" + (++it * 20) +
            "&limit=" + limit,
            "GET",
            oauth_access_token,
            oauth_access_token_secret,

            function(error, data, response) {
                var liked_posts = JSON.parse(data).response.liked_posts,
                    host = '',
                    path = '',
                    completeUrl = '';
                limitOfCurrentIteration = liked_posts.length;
                for (var i in liked_posts) {
                    if (typeof liked_posts[i].photos !== 'undefined') {
                        completeUrl = liked_posts[i].photos[0].original_size.url;
                        host = completeUrl.split('.com')[0] + '.com';
                        path = completeUrl.split('.com')[1];
                        fileName = completeUrl.split('/')[completeUrl.split('/').length - 1];
                        getAndSaveImage(fileName, host.replace('http://', ''), path);
                    } else {
                        console.log("No photos available for this post: %j", liked_posts[i]);
                    }
                }
            });
    }

    /**
     * [getOAuthRequestTokenCallback description]
     * @param  {[type]} error
     * @param  {[type]} oauth_token
     * @param  {[type]} oauth_token_secret
     * @param  {[type]} results
     * @return {[type]}
     */
    function getOAuthRequestTokenCallback(error, oauth_token, oauth_token_secret, results) {
        if (error) {
            util.puts('error :' + error);
        } else {
            oa.getOAuthAccessToken(oauth_token, oauth_token_secret, getOAuthAccessTokenCallback);
        }
    }

    /**
     * [getLikes description]
     * @param  {[type]} numberOfLikes
     * @return {[type]}
     */
    function getLikes(numberOfLikes) {
        numberOfLikes = numberOfLikes;
        iterations = Math.ceil(numberOfLikes / 20);
        oa.getOAuthRequestToken(getOAuthRequestTokenCallback);
    }

    /**
     *
     */
    return {
        getLikes: getLikes
    };

})('blog.andrescarreno.co', 'pXcUXQdlBndW7znq4C4vodeQg0OxCXOlXv2RamTphjNFj0MuzI', 'pKSNVyIcxqQFt4YAZdeBINkmC1s9TREcBlEJe59a9Rnla7GM7P', './Likes/');

TumblrLksDownldr.getLikes(500);