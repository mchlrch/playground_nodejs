// start silent: npm start -s
const fetch = require('node-fetch');
const res = require('./res');

function log({contentEncoding, contentLength, contentType, url, status=-1, duration, age='', xVarnish='', comment=''}) {
    var ts = new Date().toLocaleString();
    console.log(`${ts};${contentEncoding};${contentLength};${contentType};${url};${status};${duration};${age};${xVarnish};${comment}`);
}

function elapsedTime(startMilllis) {
  return Date.now() - startMilllis;
}

function fetchAndLog(fetchUrl, acceptMimeType) {
  const startMilllis = Date.now();
  
  return fetch(fetchUrl, {
    method: 'GET',
    headers: { 'Accept': acceptMimeType}
  })
  .then(response => {
    
    const contentEncoding = response.headers.get('Content-Encoding');
    const contentLength = response.headers.get('Content-Length');
    const contentType = response.headers.get('Content-Type');

    const age = response.headers.get('age');
    const xVarnish = response.headers.get('x-varnish');
    
    log({
      contentEncoding: contentEncoding,
      contentLength: contentLength,
      contentType: contentType,
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
}

const chains = ((numberOfParallelRequests) => {
    const chains = [];
    while(numberOfParallelRequests--) chains.push(Promise.resolve());
    return chains;
  })(3);

function queueUpShapeRequests(acceptMimeTypes) {
  var requestCount = 0;
  for (var i = 0; i < res.datasets.length; i++, requestCount++) {
    const dsNotation = res.datasets[i];
    const dsUrl = `http://stat.integ.stadt-zuerich.ch/dataset/${dsNotation}`;
    if ( !res.datasetsBlacklist[dsNotation]) {
      for (var m = 0; m < acceptMimeTypes.length; m++, requestCount++) {
        const acceptMimeType = acceptMimeTypes[m];
        
        const chainIndex = requestCount % chains.length;
        chains[chainIndex] = chains[chainIndex].then(() => fetchAndLog(dsUrl, acceptMimeType));
        // console.log(`chain[${chainIndex}]: ${acceptMimeType}  ${dsUrl}`);
      }
    }
  }
}

// console.log(chains);

// -------------------------
queueUpShapeRequests([
  'application/json',
  'application/ld+json'
]);

// TODO
// response.size
// Accept-Encoding: gzip, deflate