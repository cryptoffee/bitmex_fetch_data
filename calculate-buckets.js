const moment = require("moment");
module.exports = (startIso, endIso) => {
  let startMoment = moment(new Date(startIso));
  const endMoment = moment(new Date(endIso));

  // collect all minutes between timestamps into array
  const allMinuteMoments = [];
  while (startMoment.diff(endMoment) <= 0) {
    allMinuteMoments.push(startMoment.clone());
    startMoment = startMoment.add("1", "m");
  }

  // for each minute between the timestamps
  // push into buckets of 500
  const timePeriods = [];
  let currentBucket = [];
  allMinuteMoments.forEach((period, index) => {
    currentBucket.push(period);

    const bucketCapacityReached = currentBucket.length === 500;
    const isLastBucket = index === allMinuteMoments.length - 1;
    const pushCurrentBucketIntoTimePeriods =
      bucketCapacityReached || isLastBucket;
    if (pushCurrentBucketIntoTimePeriods) {
      timePeriods.push(currentBucket);
      currentBucket = [];
    }
  });

  // map each bucket minute array to only start and end by first element and last element in the minute array
  const mappedBuckets = timePeriods.map((bucket, index) => {
    const firstPeriodInBucket = bucket[0]
      .subtract(index === 0 ? 0 : 1, "m")
      .toDate()
      .toISOString();
    const lastPeriodInBucket = bucket[bucket.length - 1].toDate().toISOString();

    return {
      startIso: firstPeriodInBucket,
      endIso: lastPeriodInBucket
    };
  });

  return mappedBuckets;
};
