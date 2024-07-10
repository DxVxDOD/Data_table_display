import fs from "fs";
import supertest from "supertest";
import { afterAll, beforeEach, describe, expect, test } from "vitest";
import app from "../app";
import { CRED_DB } from "../utils/config";
import { string_parser } from "../utils/parsers/general_parsers";
import { wrap_in_promise } from "../utils/wrap_in_promis";
import { get_all_credentials } from "../services/credential_service";
import { Credentials } from "../utils/types/credentials";

let api = supertest(app);
const db = string_parser(CRED_DB);
const base_user = [
  {
    username: "BaseAccount",
    password: "BasePassword",
  },
];
let url = "/api/user";

describe("Sign-up", () => {
  beforeEach(async () => {
    if (db instanceof Error) throw db;

    const { error } = await wrap_in_promise(
      fs.writeFileSync(db, JSON.stringify(base_user), "utf-8"),
    );

    if (error) throw error;
  });

  afterAll(async () => {
    if (db instanceof Error) throw db;

    const { error } = await wrap_in_promise(
      fs.writeFileSync(db, JSON.stringify(base_user), "utf-8"),
    );

    if (error) throw error;
  });

  test("User is added to DB successfully", async () => {
    const user = { username: "Orban", password: "123456789" };
    const response = await api.post(url).send(user);

    expect(response.status).toEqual(201);
    expect(response.body).toEqual("Sign-up was successful");

    const credentials = await get_all_credentials();

    if (credentials instanceof Error) throw credentials;

    const cred = credentials.find((cred) => cred.username === user.username);

    expect(cred).toBeDefined();
    expect(cred?.username).toBeDefined();
    expect(cred?.password).toBeDefined();
  });

  test("Add multiple users", async () => {
    const user: Credentials = { username: "David", password: "123456789" };
    const user2: Credentials = {
      username: "Beatrice",
      password: "123456717",
    };
    const user3: Credentials = {
      username: "Rogojan",
      password: "17171717",
    };

    await api.post(url).send(user).expect(201);
    await api.post(url).send(user2).expect(201);
    await api.post(url).send(user3).expect(201);

    const credentials = await get_all_credentials();

    if (credentials instanceof Error) throw credentials;

    const found_user = credentials.find(
      (cred) => cred.username === user.username,
    );
    const found_user2 = credentials.find(
      (cred) => cred.username === user2.username,
    );
    const found_user3 = credentials.find(
      (cred) => cred.username === user3.username,
    );

    expect(found_user).toBeDefined();
    expect(found_user?.username).toEqual(user.username);
    expect(found_user2).toBeDefined();
    expect(found_user2?.username).toEqual(user2.username);
    expect(found_user3).toBeDefined();
    expect(found_user3?.username).toEqual(user3.username);
  });
});

describe("Sign-up fail", () => {
  test("User already exists", async () => {
    const user = { username: "David", password: "123456789" };
    const response = await api.post(url).send(user);

    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual("Username already exists.");
  });

  test("Wrong url param", async () => {
    url = "/api/user/wrong-user";

    const user = { username: "David", password: "123456789" };
    const response = await api.post(url).send(user);

    expect(response.status).toEqual(404);
  });
});
