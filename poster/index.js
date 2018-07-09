// start silent: npm start -s

const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

function log({url, status=-1, duration, age='', xVarnish='', comment=''}) {
    var ts = new Date().toLocaleString();
    console.log(`${ts};${url};${status};${duration};${age};${xVarnish};${comment}`);
}

function elapsedTime(startMilllis) {
    return Date.now() - startMilllis;
}

// -------------------------

const fetchUrl = '';

const sparqlQuery = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX qb: <http://purl.org/linked-data/cube#>

SELECT * WHERE {
  FILTER (regex(?syntheticLabel, ?regex))
  BIND("^Bevölk" AS ?regex)
  {
    SELECT * WHERE {
      ?dataSet a qb:DataSet ;
               rdfs:label ?label .
      FILTER (regex(?label, "^Bev"))
      BIND("Bevölkerung" AS ?syntheticLabel)
    }
  }
} 
LIMIT 10
`;

const params = new URLSearchParams();
params.append('query', sparqlQuery);

const startMilllis = Date.now();
fetch(fetchUrl, {
    method: 'POST',
    body: params,
    headers: { 'Accept': 'text/csv'}
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
     console.log(json);
  }).catch(error => {
    log({
      url: fetchUrl,
      duration: elapsedTime(startMilllis),
      comment: `"fetch failed: ${error.message}"`
    });
  });
