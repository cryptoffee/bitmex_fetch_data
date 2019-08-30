const moment = require("moment");
const { assert } = require("chai");
const calculateBuckets = require("../calculate-buckets");

describe("calculate buckets", () => {
  const startTs = "2019-01-01T00:00:00.000Z";
  const endTs = "2019-01-01T17:00:00.000Z";

  const timePeriods = calculateBuckets(startTs, endTs);

  it("should have 500 minutes in a full bucket", () => {
    const {
      startIso: firstPeriodStartIso,
      endIso: firstPeriodEndIso
    } = timePeriods[1];

    const actualMsDiff = moment(firstPeriodEndIso).diff(
      moment(firstPeriodStartIso)
    );
    const expectedMsDiff = 1000 * 60 * 500;
    assert.equal(actualMsDiff, expectedMsDiff);
  });

  it('should have less than 500 if last bucket', () => {
    const {
      startIso: firstPeriodStartIso,
      endIso: firstPeriodEndIso
    } = timePeriods[timePeriods.length - 1];

    const actualMsDiff = moment(firstPeriodEndIso).diff(
      moment(firstPeriodStartIso)
    );
    const expectedMsDiff = 1000 * 60 * 21;
    assert.equal(actualMsDiff, expectedMsDiff);
  });
  it("should calculate 3 buckets", () => {
    assert.deepEqual(timePeriods, [
      {
        startIso: "2019-01-01T00:00:00.000Z",
        endIso: "2019-01-01T08:19:00.000Z"
      },
      {
        startIso: "2019-01-01T08:19:00.000Z",
        endIso: "2019-01-01T16:39:00.000Z"
      },
      {
        startIso: "2019-01-01T16:39:00.000Z",
        endIso: "2019-01-01T17:00:00.000Z"
      }
    ]);
  });
});
