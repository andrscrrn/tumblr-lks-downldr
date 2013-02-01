TumblrFavesDownldr
==================

A simple node.js script that allow users to backup their Tumblr favorites.


How to use
==========

    1. Install node.js http://nodejs.org/ and the node-oauth API.
        $ npm install oauth
    2. Edit script with your info: 
        'YOUR_TUMBLR_URL','YOUR_OAUTH_CONSUMER_KEY','YOUR_SECRET_KEY','LOCAL_PATH_FOR_YOUR_FAVORITES'
        If you don't know anything about this please check this link: http://www.tumblr.com/oauth/apps
    3. Make sure that the 'LOCAL_PATH_FOR_YOUR_FAVORITES' already exist on your machine. This is relative about where you run the script.
    4. Change the getFavorites parameter for the number you want.
    5. Run script with node via terminal.


Change History
============== 

* 0.1
    - getFavorites method.
