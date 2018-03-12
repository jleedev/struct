"use strict";

const { expect } = require("chai");
const fs = require("fs-extra");

const TzFile_Header = require("./tzfile");

describe("TzFile_Header", function() {
  /**
   * @type {ArrayBuffer}
   */
  let testData;
  before(async function() {
    testData = (await fs.readFile(`/usr/share/zoneinfo/America/New_York`))
      .buffer;
  });

  it("sizeof", function() {
    expect(TzFile_Header.sizeOf()).eq(44);
  });

  it("from arraybuffer", function() {
    const ex = new TzFile_Header(testData);
    expect(ex).property("magic");
    const magicStr = new Uint8Array(
      ex.magic.buffer,
      ex.magic.byteOffset,
      ex.magic.byteLength
    );
    expect(magicStr.toString()).eq("84,90,105,102"); // "TZif"
    expect(ex.version.getUint8(0)).eq(50); // '2'
    expect(ex).property("tzh_ttisgmtcnt", 4);
    expect(ex).property("tzh_ttisstdcnt", 4);
    expect(ex).property("tzh_leapcnt", 0);
    expect(ex).property("tzh_timecnt", 235);
    expect(ex).property("tzh_typecnt", 4);
    expect(ex).property("tzh_charcnt", 16);
  });
});
