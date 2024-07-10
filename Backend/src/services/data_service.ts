import { wrap_in_promise } from "../utils/wrap_in_promis";
import fs from "fs";
import { parse } from "csv-parse";
import {
  Electricity_Price,
  electricity_price_keys,
} from "../utils/types/electricity_prices_type";
import { string_parser } from "../utils/parsers/general_parsers";

export async function get_all_prices() {
  const electricity_array: Electricity_Price[] = [];
  const { error } = await wrap_in_promise(
    fs
      .createReadStream(
        "/home/david/HyperCube_assesment/Backend/db/electricity_prices.csv",
      )
      .pipe(parse({ delimiter: ",", fromLine: 2 }))
      .on("data", function(row: string[]) {
        let electricity_price = new Electricity_Price();
        const rv = row[0];

        if (rv !== undefined) electricity_price.time = rv;

        for (let i = 1; i < row.length; i++) {
          const row_value = row[i];
          const key = Object.keys(electricity_price)[i];
          if (key !== undefined && row_value !== undefined) {
            electricity_price[key as keyof Electricity_Price] =
              parseFloat(row_value).toFixed(2);
          }
        }
        electricity_array.push(electricity_price);
      })
      .on("end", () => {
        console.log("CVS file parsed.");
      }),
  );

  if (error) {
    return new Error("Could not parse CSV.", error);
  }

  return electricity_array;
}

export function split_prices_in_range(
  range_url: string,
  prices: Electricity_Price[],
) {
  const range = range_url.split("-");

  if (range.length !== 2) {
    return new Error("Range url params are invalid");
  }

  const start_string = string_parser(range[0]);
  const finish_string = string_parser(range[1]);

  if (start_string instanceof Error) return start_string;
  if (finish_string instanceof Error) return finish_string;

  const start = parseInt(start_string);
  const finish = parseInt(finish_string);

  if (typeof start !== "number" || isNaN(start) || start < 0) {
    return new Error("Provided start range must be a positive integer.");
  }

  if (typeof finish !== "number" || isNaN(finish) || finish < 0) {
    return new Error("Provided finish range must be a positive integer.");
  }

  if (finish < start) {
    return new Error("Finish range must be larger than start range.");
  }

  const split_data = {
    length: prices.length,
    data: prices.slice(start, finish),
  };

  return split_data;
}

export function filter_prices_column(
  data: Electricity_Price[],
  field_name?: string,
) {
  const key = string_parser(field_name);
  if (key instanceof Error) {
    return key;
  }
  if (!electricity_price_keys.includes(key)) {
    return new Error("string not in electricity prices keys array.");
  }

  const prices = data.map((ep) => ep[key as keyof Electricity_Price]);

  return prices;
}
