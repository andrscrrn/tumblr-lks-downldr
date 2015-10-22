# Tumblr-Lks-Downldr

Simple and dumb utility for downloading your precious Tumblr likes.

You have probably liked posts with text, photos, quotes, links, chats, audio, videos or/and answers BUT this is just for images. The good news is that if you have like posts with a lot of images, they would be downloaded too!

## How to use

If you're not a developer, don't worry. Just go to the [Node.js](https://nodejs.org) website and click on the big DOWNLOAD button. We need NodeJS installed in order to run ```tumblr-lks-downldr```. Next big step, open your Terminal application on Mac and follow the next steps (I didn't test this on Windows yet but it should be almost the same).

Install the module globally and then you'll have access to the ```tumblr-lks-downldr``` command anywhere on your system:
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

## Stable Version
The 1.0.0 release seems to be stable but if you found a bug you can [report it](https://github.com/andresdavid90/tumblr-lks-downldr/issues).
