export class Electricity_Price {
  time: string;
  price: string;
  volume: string;
  settlement_period: string;
  hour: string;
  quarter: string;
  year: string;
  day_of_year: string;
  day_of_month: string;
  week_of_year: string;
  SAP: string;
  EU_ETS: string;
  gas: string;
  INDO: string;

  constructor() {
    this.time = "";
    this.price = "";
    this.volume = "";
    this.settlement_period = "";
    this.hour = "";
    this.quarter = "";
    this.year = "";
    this.day_of_year = "";
    this.day_of_month = "";
    this.week_of_year = "";
    this.SAP = "";
    this.EU_ETS = "";
    this.gas = "";
    this.INDO = "";
  }
}

export const electricity_price_keys = Object.keys(new Electricity_Price());

export type Response_Data = {
  length: number;
  data: Electricity_Price[];
};
