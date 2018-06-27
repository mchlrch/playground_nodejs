// start silent: npm start -s

const fetch = require('node-fetch');

const fetchUrl = 'http://stat.integ.stadt-zuerich.ch/tags/';
// const fetchUrl = 'http://stat.integ.stadt-zuerich.ch/static/touch-icon.png';

function log(url, status, duration, comment) {
    var ts = new Date().toLocaleString();
    console.log(`${ts};${url};${status};${duration};${comment != undefined ? comment : ''}`);
}

function elapsedTime(startMilllis) {
    return Date.now() - startMilllis;
}

const startMilllis = Date.now();
fetch(fetchUrl, {
    method: 'GET',
    headers: { 'Accept': 'application/json'}
  })
  .then(response => {
    log(fetchUrl, response.status, elapsedTime(startMilllis));

    if(response.ok) {
      return response.text();
    } 
  }).then(json => {
    // console.log(json);
  }).catch(error => {
    log(fetchUrl, -1, elapsedTime(startMilllis), `"fetch failed: ${error.message}"`);
  });