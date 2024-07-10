import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { credentials_parser } from "../utils/parsers/credentials_parser";
import { Credentials } from "../utils/types/credentials";
import { User } from "../utils/types/user";
import { wrap_in_promise } from "../utils/wrap_in_promis";
import { get_all_credentials } from "./credential_service";

export async function login(obj: Partial<Credentials> | undefined) {
  const credentials = credentials_parser(obj);

  if (credentials instanceof Error) return credentials;

  const all_credentials = await get_all_credentials();

  if (all_credentials instanceof Error) return all_credentials;

  const user_from_db = all_credentials.find(
    (cred) => cred.username === credentials.username,
  );

  if (!user_from_db) {
    return new Error("Could not find user in database");
  }

  const { data: compare_passwords, error: compare_passwords_error } =
    await wrap_in_promise(
      argon2.verify(user_from_db.password, credentials.password),
    );

  if (compare_passwords_error) return compare_passwords_error;
  if (!compare_passwords) {
    return new Error("Wrong username or password");
  }

  const { data: token, error: token_error } = await wrap_in_promise(
    jwt.sign({ username: user_from_db.username }, "David"),
  );

  if (token_error) return token_error;

  const user: User = {
    username: user_from_db.username,
    token,
  };

  return user;
}
