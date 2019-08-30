const fetchBucketedTrades = require('../fetch-bucketed-trades');


describe.skip("bitmex bucketed trades", () => {
  const startIso = "2019-01-01T00:00:00.000Z";
  const endIso = "2019-01-02T09:00:00.000Z";

  it('should return back from bitmex', done => {
    fetchBucketedTrades({
      startIso,
      endIso
    }, (err, bucketedTrades) => {
      if(err) throw err;
      if(bucketedTrades.error) throw bucketedTrades.error;
      console.log({
        bucketedTrades: bucketedTrades.slice(-2),
        size: bucketedTrades.length
      })
      done()
    })
  });
});
