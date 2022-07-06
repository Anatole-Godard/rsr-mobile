import { membersValidator as validator } from "../../core/validators";

describe("a utility that ensure members array length is at least one", () => {
  it("should return an empty string when valid members array is provided", () => {
    expect(
      validator([
        {
          fullName: "John Doe",
          uid: "user-1a",
          photoURL: "https://example.com/user-1a.jpg",
        },
      ])
    ).toBe("");
  });

  it("should return an required message when members length is zero", () => {
    expect(validator([])).toBe("Vous devez ajouter au moins un membre.");
  });

 
});
