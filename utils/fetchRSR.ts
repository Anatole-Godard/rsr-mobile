/**
 * TODO: add revalidate jwt method if (response === 401 || response === 403)
 * TODO: mutate user object when refreshing token
 *
 * @param url
 * @param user
 * @param options
 */
export const fetchRSR = async (
    url: string,
    session: any, // TODO: check if we can only define one part of the type here
    options?: any
): Promise<Response> => {
    return fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            appsource: "mobile",
            Authorization: "Bearer " + session.token,
            "Content-Type": "application/json",
            uid: session.uid
        },
    });
};
