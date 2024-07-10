import { string_parser } from "../parsers/general_parsers";
import { Credentials } from "../types/credentials";

export function credentials_parser(obj: Partial<Credentials> | undefined) {
  if (!obj || !obj.password || !obj.username) {
    return new Error("Object is invalid");
  }
  const password = string_parser(obj.password);
  const username = string_parser(obj.username);

  if (password instanceof Error) return password;

  if (username instanceof Error) return username;

  const credentials: Credentials = {
    username,
    password,
  };
  return credentials;
}
