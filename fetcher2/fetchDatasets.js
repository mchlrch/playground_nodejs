// start silent: npm start -s
const fetch = require('node-fetch');
const ds = require('./datasets');
const queueUpRequest = require('./fetchAndLog');

const datasets = ds.datasets;

const datasetsBlacklist = {
    'GEB-RAUM-ZEIT-NAF-NAM-SEX': 1,
    'BES-RAUM-ZEIT-0-0HE-BE': 1,
    'BES-RAUM-ZEIT-0-BE': 1,
    'BES-RAUM-ZEIT-0HE-0SE-1-BE': 1,
    'BES-RAUM-ZEIT-0HE-0SE-2-BE': 1,
    'BES-RAUM-ZEIT-0SE-1-BE': 1,
    'BES-RAUM-ZEIT-0SE-2-BE': 1
}

const acceptMimeTypes = [
    'application/json',
    'application/ld+json'
];

function queueUpShapeRequest(url, acceptMimeType) {
    // console.log(url, acceptMimeType);
    queueUpRequest(url, acceptMimeType);
}

for (var i = 0; i < datasets.length; i++) {
    const dsNotation = datasets[i];
    const dsUrl = `https://stat.integ.stadt-zuerich.ch/dataset/${dsNotation}`;
    if (!datasetsBlacklist[dsNotation]) {
        for (var m = 0; m < acceptMimeTypes.length; m++) {
            const acceptMimeType = acceptMimeTypes[m];
            queueUpShapeRequest(dsUrl, acceptMimeType);
        }
    }
}