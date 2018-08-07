// start silent: npm start -s
const fetch = require('node-fetch');
const ds = require('./datasets');

const datasets = ds.datasets;

const datasetsBlacklist = {
    // integ
    // 'AVA-RAUM-ZEIT-HEL-SEX': 1,
    'BEW-RAUM-ZEIT-HEL': 1
}

const acceptMimeTypes = [
    'application/json',
    'application/ld+json'
];

function queueUpShapeRequest(url, acceptMimeType) {
    console.log(url, acceptMimeType);
}

for (var i = 0; i < datasets.length; i++) {
    const dsNotation = datasets[i];
    const dsUrl = `http://stat.integ.stadt-zuerich.ch/dataset/${dsNotation}`;
    if (!datasetsBlacklist[dsNotation]) {
        for (var m = 0; m < acceptMimeTypes.length; m++) {
            const acceptMimeType = acceptMimeTypes[m];
            queueUpShapeRequest(dsUrl, acceptMimeType);
        }
    }
}