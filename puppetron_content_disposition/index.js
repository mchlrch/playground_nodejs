const express = require('express');
const fetch = require('node-fetch');
const app = express();

const fetchUrl = 'http://stat.stadt-zuerich.ch/screenshot/?url=http%3A%2F%2Fstat.integ.stadt-zuerich.ch%2Fdataset%2FBEW-RAUM-ZEIT-HEL-HEO-SEX%2Fexport'
// const fetchUrl = 'http://localhost:3000/screenshot/?url=http://www.google.com'
// const fetchUrl = 'http://stat.stadt-zuerich.ch/screenshot/?url=http://www.google.com'

app.get('/', function (req, res) {
  fetch(fetchUrl, {
      method: 'GET',
      // headers: { 'Accept': 'image/png'}
      headers: { 'Accept': 'text/html, image/png'}
    })
    .then(response => {
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.url);
      console.log(response.headers);

      return response.buffer();
    }).then(image => {
        res.header('content-type', 'image/png');
        res.header('content-disposition', 'attachment; filename=filename.png');

        res.write(image, 'binary');
        res.end(null, 'binary');
    })
})

const port = 3001;
app.listen(port, function () {
  console.log(`listening on port ${port}`);
})