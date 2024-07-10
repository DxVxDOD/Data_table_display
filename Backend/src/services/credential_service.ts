import fs from "fs";
import { CRED_DB } from "../utils/config";
import { credentials_parser } from "../utils/parsers/credentials_parser";
import { string_parser } from "../utils/parsers/general_parsers";
import { Credentials } from "../utils/types/credentials";
import { wrap_in_promise } from "../utils/wrap_in_promis";

const credentials: Credentials[] = [];

export async function get_all_credentials() {
  const db = string_parser(CRED_DB);
  if (db instanceof Error) return db;
  const { data, error } = await wrap_in_promise(fs.readFileSync(db, "utf8"));

  if (error !== null) return error;

  const { data: cred_json, error: cred_json_error } = await wrap_in_promise<
    Credentials[]
  >(JSON.parse(data));

  if (cred_json_error !== null) {
    return cred_json_error;
  }

  for (let i = 0; i < cred_json.length; i++) {
    const safe_cred = credentials_parser(cred_json[i]);
    if (safe_cred instanceof Error) return safe_cred;
    credentials.push(safe_cred);
  }

  return credentials;
}
