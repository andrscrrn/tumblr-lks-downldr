# Tumblr-Lks-Downldr
[![npm version](https://badge.fury.io/js/tumblr-lks-downldr.svg)](https://www.npmjs.com/package/tumblr-lks-downldr)

Simple and dumb utility for downloading your precious [Tumblr](https://tumblr.com) likes.

You have probably liked posts with text, photos, quotes, links, chats, audio, videos or/and answers BUT this is just for IMAGES.

## How to use

If you're not a developer, using the a command line tool like this can be hard but no worries since I'm currently working in an user interface for it [tumblr-lks-downldr-ui](https://github.com/andresdavid90/tumblr-lks-downldr-ui). For using it right now you still need to use the command line to run it but it's basically because it is still a **work in progress**.

We need [Node.js](https://nodejs.org) installed in order to run ```tumblr-lks-downldr```.

Install the module **globally** and then you'll have access to the ```tumblr-lks-downldr``` command anywhere on your system (use the same command to update it):
```sh
npm install -g tumblr-lks-downldr
```

Then just run ```tumblr-lks-downldr``` defining you Tumblr url and the number of likes that you want to download (if you don't set any number the default is the whole list of liked posts that can actually be really big):
```sh
tumblr-lks-downldr -u 'andresdavid90.tumblr.com' -l 1000
```

And of course a custom path if you want:
```sh
tumblr-lks-downldr -u 'andresdavid90.tumblr.com' -l 1000 -p 'my-stupid-folder'
```

## Issues

I'm definitely trying to maintain the utility updated so if anyone find an issue, don't hesitate to report it [here](https://github.com/andresdavid90/tumblr-lks-downldr/issues).
