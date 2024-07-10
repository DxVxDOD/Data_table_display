import { Credentials } from "../../../Backend/src/utils/types/credentials";
import { User } from "../../../Backend/src/utils/types/user";

export const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    mode: "cors",
  }).then((res) => res.json());

export async function fetch_post_login(credentials: Credentials) {
  const raw_response = await fetch("/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const response = await raw_response.json();
  if (response.error) return Error(response.error);
  return response as User;
}
