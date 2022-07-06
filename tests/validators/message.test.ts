import { messageValidator as validator } from "../../core/validators";

describe("a utility that ensure message input is valid", () => {
  it("should return an empty string when valid message input is provided", () => {
    expect(validator("Totally approve what you said earlier")).toBe("");
  });

  it("should return an required message when message length is zero", () => {
    expect(validator("")).toBe("Le message ne peut pas être vide.");
  });
});
