import express, { Request, Response } from "express";
import { prices } from "../app";
import {
  filter_prices_column,
  split_prices_in_range,
} from "../services/data_service";
import { string_parser } from "../utils/parsers/general_parsers";

const route = express.Router();

route.get("/len", (_req: Request, res: Response) => {
  if (prices instanceof Error) {
    return res.status(400).json({ error: prices.message });
  }

  return res.status(200).json(prices.length);
});

route.get("/range/:range", async (req: Request, res: Response) => {
  const range_url = string_parser(req.params.range);

  if (range_url instanceof Error) {
    return res.status(400).json({ error: range_url.message });
  }

  if (!prices || prices instanceof Error) {
    return res.status(400).json({ error: prices });
  }

  const split_data = split_prices_in_range(range_url, prices);

  if (split_data instanceof Error) {
    return res.status(400).json({ error: split_data.message });
  }

  return res.status(200).json(split_data.data);
});

route.get("/range/:range/id/:id", async (req: Request, res: Response) => {
  const range_url = string_parser(req.params.range);

  if (range_url instanceof Error) {
    return res.status(400).json({ error: range_url.message });
  }

  if (!prices || prices instanceof Error) {
    return res.status(400).json({ error: prices.message });
  }

  const split_data = split_prices_in_range(range_url, prices);

  if (split_data instanceof Error) {
    return res.status(400).json({ error: split_data.message });
  }

  const filtered_prices = filter_prices_column(split_data.data, req.params.id);

  if (filtered_prices instanceof Error) {
    return res.status(400).json({ error: filtered_prices.message });
  }

  return res.status(200).json(filtered_prices);
});

export default route;
