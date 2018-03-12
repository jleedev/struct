"use strict";

const struct = require("./struct");

const TzFile_Header = new struct.StructBuilder("TzFile_Header")
  .field("magic", struct.bytes(4))
  .field("version", struct.bytes(16))
  .field("tzh_ttisgmtcnt", struct.u32be)
  .field("tzh_ttisstdcnt", struct.u32be)
  .field("tzh_leapcnt", struct.u32be)
  .field("tzh_timecnt", struct.u32be)
  .field("tzh_typecnt", struct.u32be)
  .field("tzh_charcnt", struct.u32be)
  .build();

module.exports = TzFile_Header;
