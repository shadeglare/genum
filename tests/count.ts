import { expect } from "chai";
import { Enumerable } from "../src";


describe("Enumerable", () => {
  it("should count correct to 0", () => {
    let seq = Enumerable.fromArray([]);
    expect(seq.count()).to.equal(0);
  });

  it("should count correct to 3", () => {
    let seq = Enumerable.fromArray([1, 2, 3]);
    expect(seq.count()).to.equal(3);
  });
});
