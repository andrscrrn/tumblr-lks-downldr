'use strict';

var http = require('http');
var fs = require('fs');

/**
 * Establish TCP connection for saving an image on disk
 * @param  {Object} image object containg data for the download process
 * @return {void}
 */
function downloadImage(image) {

  const ENCODING_TYPE = 'binary';

  return new Promise(function(resolve, reject) {

    const config = {
      host: image.host,
      port: 80,
      path: image.path
    };

    if (fs.existsSync(image.fileName)) {
      resolve(image.fileName);
    } else {
      http
        .get(config, writeImageOnDisk)
        .on('error', (err) => {
          if (err) reject(err);
        });
    }

    function writeImageOnDisk(response) {

      let imagedata = '';

      response.setEncoding(ENCODING_TYPE);

      response.on('data', (chunk) => {
        imagedata += chunk;
      });

      response.on('end', () => {
        fs.writeFile(
          image.fileName,
          imagedata,
          ENCODING_TYPE,
          (err) => {
            if (err) {
              reject(Error('There was a problem saving the file.'));
            }
            resolve(image.fileName);
          }
        );
      });
    }
  });
}

module.exports = downloadImage;
