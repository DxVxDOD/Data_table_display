import { describe } from "node:test";
import { beforeAll, expect, test } from "vitest";
import { Electricity_Price } from "../utils/types/electricity_prices_type";
import supertest, { Response } from "supertest";
import app from "../app";

let url = "/api/data/range/100-200";
const api = supertest(app);

describe("Testing /range/:range endpoint", () => {
  let response: Response;
  let body: Electricity_Price[];
  beforeAll(async () => {
    response = await api.get(url);
    body = response.body as Electricity_Price[];
  });

  test("Response should have status 200", () => {
    expect(response.status).toBe(200);
  });
  test("Returned data should be formatted correctly", () => {
    expect(body).toHaveLength(100);
    body.map((price) => {
      expect(price.price).toBeDefined();
      expect(parseFloat(price.price)).toBeTypeOf("number");
      expect(price.time).toBeDefined();
      expect(parseFloat(price.time)).toBeTypeOf("number");
      expect(price.gas).toBeDefined();
      expect(parseFloat(price.gas)).toBeTypeOf("number");
      expect(price.SAP).toBeDefined();
      expect(parseFloat(price.SAP)).toBeTypeOf("number");
      expect(price.hour).toBeDefined();
      expect(parseFloat(price.hour)).toBeTypeOf("number");
      expect(price.INDO).toBeDefined();
      expect(parseFloat(price.INDO)).toBeTypeOf("number");
      expect(price.year).toBeDefined();
      expect(parseFloat(price.year)).toBeTypeOf("number");
      expect(price.EU_ETS).toBeDefined();
      expect(parseFloat(price.EU_ETS)).toBeTypeOf("number");
      expect(price.volume).toBeDefined();
      expect(parseFloat(price.volume)).toBeTypeOf("number");
      expect(price.quarter).toBeDefined();
      expect(parseFloat(price.quarter)).toBeTypeOf("number");
      expect(price.day_of_year).toBeDefined();
      expect(parseFloat(price.day_of_year)).toBeTypeOf("number");
      expect(price.day_of_month).toBeDefined();
      expect(parseFloat(price.day_of_month)).toBeTypeOf("number");
      expect(price.week_of_year).toBeDefined();
      expect(parseFloat(price.week_of_year)).toBeTypeOf("number");
      expect(price.settlement_period).toBeDefined();
      expect(parseFloat(price.settlement_period)).toBeTypeOf("number");
    });
  });
});

describe("Endpoint should fail", () => {
  let response: Response;
  let body: Electricity_Price[];

  test("Wrong finish url param", async () => {
    url = "/api/data/range/100-data";
    response = await api.get(url);
    body = response.body as Electricity_Price[];
    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual(
      "Provided finish range must be a positive integer.",
    );
  });

  test("Wrong start url param", async () => {
    url = "/api/data/range/data-200";
    response = await api.get(url);
    body = response.body as Electricity_Price[];
    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual(
      "Provided start range must be a positive integer.",
    );
  });

  test("Start is larger than finish", async () => {
    url = "/api/data/range/300-200";
    response = await api.get(url);
    body = response.body as Electricity_Price[];
    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual(
      "Finish range must be larger than start range.",
    );
  });
});
