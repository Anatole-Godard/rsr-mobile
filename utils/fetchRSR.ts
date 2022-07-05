/**
 * It fetches a resource from the RSR API.
 *
 * TODO: add revalidate jwt method if (response === 401 || response === 403)
 * TODO: mutate user object when refreshing token
 *
 * @param {string} url - The URL to fetch.
 * @param {any} session - the session object that contains the token and uid
 * @param {any} [options] - any
 * @returns A promise that resolves to a response object.
 */
export const fetchRSR = async (
  url: string,
  session: { token: string; uid: string },
  options?: any
): Promise<Response> => {
  if (!url) throw new Error("url is required");
  if (!session) throw new Error("session is required");
  if (!session.token) throw new Error("session.token is required");
  if (!session.uid) throw new Error("session.uid is required");

  return fetch(url, {
    ...options,
    headers: {
      Authorization: "Bearer " + session.token,
      ...options?.headers,
      appsource: "web",
      "Content-Type": "application/json",
      uid: session.uid,
    },
  })
    .then((res) => {
      if (res.ok) {
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    })
    .catch((err) => {
      return Promise.reject({
        error: {
          message: err.message,
          location: "fetchRSR",
        },
      });
    });
};
