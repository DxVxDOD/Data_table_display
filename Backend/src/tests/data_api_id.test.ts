import { beforeAll, describe, expect, test } from "vitest";
import { electricity_price_keys } from "../utils/types/electricity_prices_type";
import supertest, { Response } from "supertest";
import app from "../app";

const id = electricity_price_keys;
const api = supertest(app);

describe("Testing /range/:range/:id endpoint", async () => {
  const url = `/api/data/range/0-100/id/${id[0]}`;
  let response: Response;
  let body: string[];

  beforeAll(async () => {
    response = await api.get(url);
    body = response.body as string[];
  });

  test("Response should have status 200", () => {
    expect(response.status).toBe(200);
  });

  test("Response should be a string array", () => {
    body.forEach((s) => {
      expect(s).toBeTypeOf("string");
      expect(parseFloat(s)).toBeTypeOf("number");
    });
  });
});

describe("Endpoint should fail without url params", () => {
  const url = `/api/data/range/0-100/id/wrong-param`;
  let response: Response;
  let body: string[];

  beforeAll(async () => {
    response = await api.get(url);
    body = response.body as string[];
  });

  test("Appropriate error message", () => {
    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual(
      "string not in electricity prices keys array.",
    );
  });
});
