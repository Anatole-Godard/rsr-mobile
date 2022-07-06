import { nameValidator as validator } from "../../core/validators";

describe("a utility that ensure name input is valid", () => {
  it("should return an empty string when valid name input is provided", () => {
    expect(validator("John Doe")).toBe("");
  });

  it("should return an required message when name length is zero", () => {
    expect(validator("")).toBe("Le nom ne peut pas être vide.");
  });
});
