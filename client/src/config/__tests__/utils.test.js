import { capitialize } from "../utils";

describe("capitialize", () => {
  it("capitalizes the first letter of a string", () => {
    expect(capitialize("hello")).toBe("Hello");
  });
  it("returns empty string when empty", () => {
    expect(capitialize("")).toBe("");
  });
});
