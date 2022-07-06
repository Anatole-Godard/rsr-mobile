import { fetchRSR } from "../utils/fetchRSR";

const _MOCK_URL_ = "https://jsonplaceholder.typicode.com/todos/1";
const _MOCK_SESSION_UID_ = "12345";
const _MOCK_SESSION_TOKEN_ = "12345";

describe("a utility that fetches a resource from the RSR API", () => {
  it("should throw an error if no url", async () => {
    await expect(
      fetchRSR(undefined, {
        token: _MOCK_SESSION_TOKEN_,
        uid: _MOCK_SESSION_UID_,
      })
    ).rejects.toThrow("url is required");
  });

  it("should throw an error if no session", async () => {
    await expect(fetchRSR(_MOCK_URL_, undefined)).rejects.toThrow(
      "session is required"
    );
  });

  it("should throw an error if no session.token", async () => {
    await expect(
      fetchRSR(_MOCK_URL_, { uid: _MOCK_SESSION_UID_ } as {
        uid: string;
        token: string;
      })
    ).rejects.toThrow("session.token is required");
  });

  it("should throw an error if no session.uid", async () => {
    await expect(
      fetchRSR(_MOCK_URL_, { token: _MOCK_SESSION_TOKEN_ } as {
        uid: string;
        token: string;
      })
    ).rejects.toThrow("session.uid is required");
  });
});
