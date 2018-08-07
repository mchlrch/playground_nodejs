const fetch = require('node-fetch');

fetch("http://www.mozilla.org/bla", {
    method: 'GET',
    headers: { 'Accept': 'application/json'}

  }).then(response => {

    console.log("Status: ", response.status);
    // console.log("OK", JSON.stringify(response, null, 2));
    
    return response.text();
  })
  .then(text => {
    console.log(text);

  })
  .catch(error => {
    console.log("ERROR", JSON.stringify(error, null, 2));
  });
