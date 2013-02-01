var tumblrFavesDownldr = (function(tumblrBlog,key,secret,localPath){

	var util = require('util'),
	OAuth = require('oauth').OAuth,
	fs = require('fs'),
	http = require('http'),

	oa = new OAuth("http://www.tumblr.com/oauth/request_token",
				"http://www.tumblr.com/oauth/access_token",
				key,
				secret,
				"1.0",
				null,
				"HMAC-SHA1"),

	tumblrURL = tumblrBlog,
	offset = '',
	it = 0,
	imagesSaved = 0,
	limit = 20,
	iterations = 0,
	aux = 0,
	_numberOfFavorites = 0;

	var getAndSaveImage = function(filename,host,path){
		var fn = filename,
			options = {
				host: host,
				port: 80,
				path: path
			};

		http.get(options, function (res) {
			var imagedata = '';
			res.setEncoding('binary');

			res.on('data', function (chunk) {
				imagedata += chunk;
			});

			res.on('end', function () {
				fs.writeFile(localPath + fn, imagedata, 'binary', function (err) {
					if (err) throw err;
					util.puts(fn + ' SAVED (' + (++imagesSaved) + ')');
				});
			});
		});
	};

	var getOAuthAccessTokenCallback = function (error, oauth_access_token, oauth_access_token_secret, results2) {
		
		if(++aux === iterations){
			limit = _numberOfFavorites % 20;
		}

		var data = "";

		oa.getProtectedResource("http://api.tumblr.com/v2/blog/" + tumblrURL +
			"/likes?api_key=" + key + "&offset=" + (++it * 20) +
			"&limit=" + limit,
			"GET",
			oauth_access_token,
			oauth_access_token_secret,

			function (error, data, response) {
				var liked_posts = JSON.parse(data).response.liked_posts,
				host = '',
				path = '',
				completeUrl = '';

				for (var i in liked_posts) {
					completeUrl = liked_posts[i].photos[0].original_size.url;
					host = completeUrl.split('.com')[0] + '.com';
					path = completeUrl.split('.com')[1];
					fileName = completeUrl.split('/')[completeUrl.split('/').length - 1];
					getAndSaveImage(fileName,host.replace('http://',''),path);
				}
			});
	};

	var getOAuthRequestTokenCallback = function (error, oauth_token, oauth_token_secret, results) {
		if (error) {
			util.puts('error :' + error);
		} else {
			oa.getOAuthAccessToken(oauth_token, oauth_token_secret, getOAuthAccessTokenCallback);
		}
	};

	var getFavorites = function (numberOfFavorites){
		_numberOfFavorites = numberOfFavorites;
		iterations = Math.ceil(numberOfFavorites / 20);
		for(var i = 0; i < iterations; i++){
			oa.getOAuthRequestToken(getOAuthRequestTokenCallback);
		}
	};

	return {
		getFavorites: getFavorites
	};

})('blog.andrescarreno.co','pXcUXQdlBndW7znq4C4vodeQg0OxCXOlXv2RamTphjNFj0MuzI','pKSNVyIcxqQFt4YAZdeBINkmC1s9TREcBlEJe59a9Rnla7GM7P','');

tumblrFavesDownldr.getFavorites(20);
