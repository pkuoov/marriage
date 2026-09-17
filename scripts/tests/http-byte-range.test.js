import test from "node:test";
import assert from "node:assert/strict";
import { parseByteRange } from "../lib/http-byte-range.js";

test("音频首字节探测、开放区间与尾部定位", () => {
  assert.deepEqual(parseByteRange("bytes=0-1", 100), { start: 0, end: 1 });
  assert.deepEqual(parseByteRange("bytes=40-", 100), { start: 40, end: 99 });
  assert.deepEqual(parseByteRange("bytes=-20", 100), { start: 80, end: 99 });
  assert.deepEqual(parseByteRange("bytes=-200", 100), { start: 0, end: 99 });
  assert.deepEqual(parseByteRange("bytes=40-200", 100), { start: 40, end: 99 });
});
test("不可满足的区间拒绝读取，避免负数与越界", () => {
  for (const header of ["bytes=100-", "bytes=80-40", "bytes=-0", "bytes=999999999999999999999-"]) {
    assert.deepEqual(parseByteRange(header, 100), { unsatisfiable: true });
  }
  assert.deepEqual(parseByteRange("bytes=0-1", 0), { unsatisfiable: true });
});
test("未请求区间、非法格式与多区间回退完整响应", () => {
  for (const header of [undefined, "bytes=-", "bytes=wat", "bytes=0-1,20-30", "seconds=0-20"]) assert.equal(parseByteRange(header, 100), null);
});
