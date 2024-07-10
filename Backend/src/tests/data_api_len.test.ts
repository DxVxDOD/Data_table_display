import supertest, { Response } from "supertest";
import { beforeAll, describe, expect, test } from "vitest";
import app from "../app";

let url = "/api/data/len";
const api = supertest(app);

describe("Testing /len", () => {
  let response: Response;
  let body: number;
  beforeAll(async () => {
    response = await api.get(url);
    body = response.body as number;
  });
  test("Response should be of status 200", () => {
    expect(response.status).toBe(200);
  });
  test("Returned values should be number", () => {
    expect(body).toBeTypeOf("number");
  });
});
