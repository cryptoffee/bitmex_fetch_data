const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
if (!process.env.BITMEX_API_KEY) throw new Error("No api key");

const http = require("http");
const fs = require("fs");
const async = require("async");

const getTradesBucketUtil = require("./bitmex/trade/bucketed");
const calculateBuckets = require("./calculate-buckets.js");

http.globalAgent.maxSockets = Infinity;

module.exports = ({ startIso, endIso, writeFile, verbose }, cb) => {
  
  console.error("cryptoffee");
  
  console.error({
    startIso,
    endIso
  });
  const timePeriods = calculateBuckets(startIso, endIso);
  let requestsFinished = 0;
  const seriesStartTs = new Date();
  async.series(
    timePeriods.map((p, index) => {
      return (parallelCb) => {
        const { startIso, endIso } = p;
        const requestStartTs = new Date();
        getTradesBucketUtil(
          {
            apiKey: process.env.BITMEX_API_KEY,
            apiSecret: process.env.BITMEX_API_SECRET,
            startTime: startIso,
            endTime: endIso
          },
          (err, {xHeaders, bucketedTrades}) => {
            if (err) {
              parallelCb(err);
              console.error("ERROR", {
                err
              })
              process.exit(-1)
              return;
            }
            let timeoutMs = 6000;
            if(xHeaders['']);
            requestsFinished++;
            const requestDurationSeconds = parseInt(Math.abs(requestStartTs - new Date())) / 1000;
            const seriesDurationSeconds = parseInt(Math.abs(seriesStartTs - new Date())) / 1000;
            const ratio = requestsFinished / seriesDurationSeconds
            setTimeout(() => {
              console.error({
                ratio,
                requestsFinished,
                requestDurationSeconds,
                seriesDurationSeconds,
                requestsRemaining: xHeaders['x-ratelimit-remaining']
              })
              console.error(
                `bucket ${index + 1}/${timePeriods.length} - ${(
                  (requestsFinished / timePeriods.length) *
                  100
                ).toFixed(2)}%`
              );
              parallelCb(null, bucketedTrades);
            }, requestDurationSeconds > 1.0 ? 0 : Math.max(1000 * (1 - ratio), 0));
          }
        );
      };
    }),
    (err, results) => {
      const concattedResults = results.reduce((acc, data) => {
        return acc.concat(data);
      }, []);
      const filePath = path.join(
        __dirname,
        "data",
        `${startIso}__${endIso}.json`
      );
      const jsonString = JSON.stringify(concattedResults, null, 2);

      if (writeFile) {
        fs.writeFile(filePath, jsonString, err => {
          if (err) throw err;
          
          console.error(`finished writing bucketed trades to \n${filePath}`);
          process.exit(0);
        });
      } else {
        console.log(jsonString);
      }
    }
  );
};
