TumblrLksDownldr
==================

Simple and dumb utility for downloading your precious tumblr likes.


How to use
==========

Install this globally and you'll have access to the tumblr-lks-downldr command anywhere on your system.
```sh
npm install -g tumblr-lks-downldr
```
Then just run ```tumblr-lks-downldr``` and define you tumblr url:
```sh
tumblr-lks-downldr -u 'andresdavid90.tumblr.com'
```
You can also set a number of likes that you want to download:
```sh
tumblr-lks-downldr -u 'andresdavid90.tumblr.com' -l 1000
```
And of course a custom path if you want:
```sh
tumblr-lks-downldr -u 'andresdavid90.tumblr.com' -l 1000 -p 'my-stupid-folder/'
```

Be aware!
========================

I've been trying to make this script to work perfectly for every user and number of likes but it seems that
the Tumblr API has some undocumented limits.

https://groups.google.com/forum/?fromgroups=#!searchin/tumblr-api/likes/tumblr-api/rJdk9DTIaxY/WkJ6mvb-9SgJ

Apparently my logic is correct but I was not warned from the beginning about these limits and well, you can
not backup ALL your likes, just the last one thousand (1000).
