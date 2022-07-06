import { emailValidator as validator } from "../../core/validators";

describe("a utility that ensure a passed string is an email", () => {
  it("should return an empty string when valid email is provided", () => {
    expect(validator("johndoe@doe.com")).toBe("");
  });

  it("should return an required message when no email is provided", () => {
    expect(validator("")).toBe("L'adresse email est requise.");
  });

  it("should return an invalid message when invalid email is provided", () => {
    expect(validator("no way")).toBe(
      "Oups! Nous n'acceptons que les emails valides."
    );
  });
});
