"use strict";

/**
 * Generic view over the bytes in this slice of the struct
 *
 * Get: Returns a {DataView}
 * Set: Copies the {DataView}
 * @param {number} byteLength
 */
function bytes(byteLength) {
  return function(byteOffset) {
    return {
      get: function() {
        return new DataView(this.buffer, byteOffset, byteLength);
      },
      set: function(value) {
        assert.strictEqual(value.constructor, DataView);
        assert.strictEqual(value.byteLength, byteLength);
        const target = new Uint8Array(this.buffer, byteOffset, byteLength);
        const source = new Uint8Array(value.buffer);
        target.set(source);
      },
      sizeOf: byteLength
    };
  };
}

/**
 * Big-endian 32-bit integer
 * @param {number} byteOffset
 */
function u32be(byteOffset) {
  return {
    get: function() {
      return this.dataView.getUint32(byteOffset, false);
    },
    set: function(value) {
      this.dataView.setUint32(byteOffset, value, false);
    },
    sizeOf: 4
  };
}

class StructBuilder {
  constructor(name) {
    this.name = name;
    this.runningOffset = 0;
    this.descriptors = {};
  }
  /**
   * @param {string} name
   * @param {byteOffset => descriptor} descriptor
   */
  field(name, descriptorFn) {
    const descriptor = descriptorFn(this.runningOffset);
    descriptor.enumerable = true;
    this.runningOffset += descriptor.sizeOf;
    this.descriptors[name] = descriptor;
    return this;
  }
  /**
   * @return {class Struct}
   */
  build() {
    const name = this.name;
    const sizeOf = this.runningOffset;
    const result = function(buffer, byteOffset = 0) {
      this.buffer = buffer;
      this.dataView = new DataView(buffer, byteOffset, sizeOf);
    };
    Object.defineProperty(result, "name", { value: name });
    Object.defineProperties(result.prototype, this.descriptors);
    result.sizeOf = function() {
      return sizeOf;
    };
    return result;
  }
}

module.exports = {
  bytes,
  u32be,
  StructBuilder,
};
