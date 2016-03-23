/**
 * Establish TCP connection for saving an image on disk
 * @param  {Object} image object containg data for the download process
 * @return {void}
 */
function downloadImage(image) {

  const ENCODING_TYPE = 'binary';

  if (fs.existsSync(image.fileName)) {
    image.onEnd();
  } else {
    http.get(
      {
        host: image.host,
        port: 80,
        path: image.path
      },
      function(response) {

        var imagedata = '';

        response.setEncoding(ENCODING_TYPE);

        response.on('data', function(chunk) {
          imagedata += chunk;
        });

        response.on('end', function() {
          fs.writeFile(image.fileName, imagedata, ENCODING_TYPE, function(err) {
            if (err) throw err;
            image.onEnd();
          });
        });
      }
    )
    .on(
      'error',
      function(err) {
        if (err) {
          image.onFail();
          image.onEnd();
        }
      }
    );
  }
}

module.exports = downloadImage;
