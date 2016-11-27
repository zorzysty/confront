var prependFile = require('prepend-file');

prependFile('./src/generated/styles.js', 'export const styles =`');
