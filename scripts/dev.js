const rendererStart = require('./renderer');
const main = require('./main');

rendererStart()
    .then(main);
