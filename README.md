Tumblr-Lks-Downldr
==================

Simple and dumb utility for downloading your precious Tumblr likes.


How to use
==========

Install this globally and you'll have access to the ```tumblr-lks-downldr``` command anywhere on your system.
```sh
npm install -g tumblr-lks-downldr
```

Then just run ```tumblr-lks-downldr```, define you Tumblr url and the number of likes that you want to download (if you don't set any number the default is the whole list of liked posts):
```sh
tumblr-lks-downldr -u 'andresdavid90.tumblr.com' -l 1000
```

And of course a custom path if you want:
```sh
tumblr-lks-downldr -u 'andresdavid90.tumblr.com' -l 1000 -p 'my-stupid-folder/'
```
