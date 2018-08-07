// start silent: npm start -s
const fetch = require('node-fetch');

// ================================
const numberOfParallelRequests = 5;
// ================================

function log({size, contentEncoding, contentType, url, status = -1, duration, age = '', xVarnish = '', comment = '' }) {
  var ts = new Date().toLocaleString();
  console.log(`${ts};${size};${contentEncoding};"${contentType}";${url};${status};${duration};${age};${xVarnish};${comment};${numberOfParallelRequests}`);
}

function elapsedTime(startMilllis) {
  return Date.now() - startMilllis;
}

function fetchAndLog(fetchUrl, acceptMimeType) {
  const startMilllis = Date.now();

  return fetch(fetchUrl, {
    method: 'GET',
    compress: true,
    headers: {
      'Accept': acceptMimeType,
      'Accept-Encoding': 'gzip, deflate'
    }

  }).then(response => {
    const contentEncoding = response.headers.get('Content-Encoding');
    // const contentLength = response.headers.get('Content-Length');  // Content-Length is not set if encoding is chunked
    const contentType = response.headers.get('Content-Type');

    const age = response.headers.get('age');
    const xVarnish = response.headers.get('x-varnish');

    return response.buffer().then(buffer => {
      const size = buffer.byteLength;

      log({
        contentEncoding: contentEncoding,
        size: size,
        contentType: contentType,
        url: fetchUrl,
        status: response.status,
        duration: elapsedTime(startMilllis),
        age: age != null ? age : '',
        xVarnish: xVarnish != null ? xVarnish : ''
      });

      return buffer;      
    });

  }).then(buffer => {
    // console.log(buffer.toString());

  }).catch(error => {
    log({
      url: fetchUrl,
      duration: elapsedTime(startMilllis),
      comment: `"fetch failed: ${error.message}"`
    });
  });
}


const chains = ((numberOfChains) => {
  const chains = [];
  while (numberOfChains--) chains.push(Promise.resolve());
  return chains;
})(numberOfParallelRequests);

var requestCount = 0;
function queueUpRequest(url, acceptMimeType) {
  const chainIndex = requestCount++ % chains.length;
  chains[chainIndex] = chains[chainIndex].then(() => fetchAndLog(url, acceptMimeType));
  // console.log(`chain[${chainIndex}]: ${acceptMimeType}  ${url}`);
}

module.exports = queueUpRequest;
