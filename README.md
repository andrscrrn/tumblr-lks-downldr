TumblrFavesDownldr
==================

A simple node.js script that allow users to backup their Tumblr favorites.


How to use
==========

    1. Install node.js http://nodejs.org/
    2. Edit script with your info: 
        'YOUR_TUMBLR_URL','YOUR_OAUTH_CONSUMER_KEY','YOUR_SECRET_KEY','LOCAL_PATH_FOR_YOUR_FAVORITES'
        If you don't know anything about this please check this link: http://www.tumblr.com/oauth/apps
    3. Make sure that the 'LOCAL_PATH_FOR_YOUR_FAVORITES' already exist on your machine.
    This is relative about where you run the script.
    4. Change the getFavorites parameter for the number you want.
    5. Run script with node via terminal.

BE AWARE!
========================

I've been trying to make this script to work perfectly for every user and number of likes but it seems that
the Tumblr API has some undocumented limits. 

https://groups.google.com/forum/?fromgroups=#!searchin/tumblr-api/likes/tumblr-api/rJdk9DTIaxY/WkJ6mvb-9SgJ

Apparently my logic is correct but I was not warned from the beginning about these limits and well, you can
not backup ALL your likes, just the last one thousand (1000).
