import { passwordValidator as validator } from "../../core/validators";

describe("a utility that ensure password input is valid", () => {
  it("should return an empty string when valid password is provided", () => {
    expect(validator("A3ry-c0mpl3x;pVs5w0rd!")).toBe("");
  });

  it("should return an required message when password length is zero", () => {
    expect(validator("")).toBe("Le mot de passe ne peut pas être vide.");
  });

  it("should return an required message when password length is less than 8", () => {
    expect(validator("c0mpl3x")).toBe("Le mot de passe doit contenir au moins 8 caractères.");
  })
});
