import fs from "fs";
import supertest from "supertest";
import { afterAll, beforeEach, describe, expect, test } from "vitest";
import app from "../app";
import { string_parser } from "../utils/parsers/general_parsers";
import { CRED_DB } from "../utils/config";
import { wrap_in_promise } from "../utils/wrap_in_promis";
import { get_all_credentials } from "../services/credential_service";

const url = "/api/login";
const sign_up_url = "/api/user";
const api = supertest(app);
const db = string_parser(CRED_DB);
const base_user = [
  {
    username: "BaseAccount",
    password: "BasePassword",
  },
];
const user = { username: "David", password: "123456789" };

describe("Login", () => {
  beforeEach(async () => {
    if (db instanceof Error) throw db;

    const { error } = await wrap_in_promise(
      fs.writeFileSync(db, JSON.stringify(base_user), "utf-8"),
    );

    await api.post(sign_up_url).send(user);

    const cred = await get_all_credentials();
    if (cred instanceof Error) throw cred;

    if (error) throw error;
  });

  afterAll(async () => {
    if (db instanceof Error) throw db;

    const { error } = await wrap_in_promise(
      fs.writeFileSync(db, JSON.stringify(base_user), "utf-8"),
    );

    if (error) throw error;
  });

  test("Successful login", async () => {
    const response = await api.post(url).send(user);

    expect(response.status).toEqual(200);

    const cred = await get_all_credentials();

    if (cred instanceof Error) throw cred;

    expect(response.body.username).toEqual(user.username);
    expect(response.body.token).toBeTypeOf("string");
  });

  test("Invalid Object structure", async () => {
    const invalid = "David1";
    const response = await api.post(url).send(invalid);

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual("Object is invalid");

    const invalid2 = {
      username: 52,
      password: "123456789",
    };
    const response2 = await api.post(url).send(invalid2);

    expect(response2.status).toEqual(401);
    expect(response2.body.error).toEqual("param not string");
  });

  test("Invalid username", async () => {
    const wrong_username = {
      username: "David1",
      password: "123456789",
    };
    const response = await api.post(url).send(wrong_username);

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual("Could not find user in database");
  });

  test("Invalid password", async () => {
    const wrong_password = {
      username: "David",
      password: "123456788",
    };
    const response = await api.post(url).send(wrong_password);

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual("Wrong username or password");
  });
});
