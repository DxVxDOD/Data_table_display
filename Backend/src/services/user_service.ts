import * as argon2 from "argon2";
import fs from "fs";
import { CRED_DB } from "../utils/config";
import { credentials_parser } from "../utils/parsers/credentials_parser";
import { string_parser } from "../utils/parsers/general_parsers";
import { Credentials } from "../utils/types/credentials";
import { wrap_in_promise } from "../utils/wrap_in_promis";
import { get_all_credentials } from "./credential_service";

export async function post_new_user(
  obj: Partial<Credentials>,
): Promise<Error | void> {
  const new_user = credentials_parser(obj);
  let credentials = await get_all_credentials();

  if (credentials instanceof Error) return credentials;

  if (new_user instanceof Error) return new_user;

  if (new_user.username.length > 16) {
    return new Error("Username is too long.");
  }

  if (new_user.username.length < 4) {
    return new Error("Username is too short.");
  }

  if (new_user.password.length > 20) {
    return new Error("Password is too long.");
  }

  if (new_user.password.length < 4) {
    return new Error("Password is too short.");
  }

  for (let i = 0; i < credentials.length; i++) {
    const username = credentials[i]?.username;

    if (!username) {
      return new Error("Undefined username");
    }

    if (new_user.username === username) {
      return new Error("Username already exists.");
    }
  }

  const { data: hash, error: hash_error } = await wrap_in_promise(
    argon2.hash(new_user.password),
  );

  if (hash_error !== null) return hash_error;

  const user: Credentials = {
    username: new_user.username,
    password: hash,
  };

  credentials.push(user);

  const db = string_parser(CRED_DB);

  if (db instanceof Error) return db;

  const { error: write_error } = await wrap_in_promise(
    fs.writeFileSync(db, JSON.stringify(credentials), "utf-8"),
  );

  if (write_error !== null) return write_error;
}
