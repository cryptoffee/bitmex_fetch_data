const fetchBucketedTrades = require('./fetch-bucketed-trades');

const startIso = process.argv[2];
const endIso = process.argv[3];
const writeFile = process.argv.some(arg => arg.includes('write'));
const verbose = process.argv.some(arg => arg.includes('verbose'));

fetchBucketedTrades({
  startIso,
  endIso,
  writeFile,
  verbose
}, () => {
  process.exit(0);
});