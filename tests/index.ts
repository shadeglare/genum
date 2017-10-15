import { expect, assert } from "chai";
import { Enumerable } from "../dist";

describe("tests", () => {
  it("should zip correct", () => {
    let left = Enumerable.fromArray([1, 2, 3]);
    let right = Enumerable.fromArray([1, 2, 3]);
    let result = left.zip(right, (l, r) => l * r).toArray();
    assert.deepEqual(result, [1, 4, 9]);
  });
});