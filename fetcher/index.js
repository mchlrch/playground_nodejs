// start silent: npm start -s

const fetch = require('node-fetch');

function log({url, status=-1, duration, age='', xVarnish='', comment=''}) {
    var ts = new Date().toLocaleString();
    console.log(`${ts};${url};${status};${duration};${age};${xVarnish};${comment}`);
}

function elapsedTime(startMilllis) {
    return Date.now() - startMilllis;
}

// -------------------------

const args = process.argv.slice(2);
const fetchUrl = args[0];

const startMilllis = Date.now();
fetch(fetchUrl, {
    method: 'GET',
    headers: { 'Accept': 'application/json'}
  })
  .then(response => {
    const age = response.headers.get('age');
    const xVarnish = response.headers.get('x-varnish');

    log({
      url: fetchUrl,
      status: response.status,
      duration: elapsedTime(startMilllis),
      age: age != null ? age : '',
      xVarnish : xVarnish != null ? xVarnish : ''
    });

    if(response.ok) {
      return response.text();
    } 
  }).then(json => {
    // console.log(json);
  }).catch(error => {
    log({
      url: fetchUrl,
      duration: elapsedTime(startMilllis),
      comment: `"fetch failed: ${error.message}"`
    });
  });
