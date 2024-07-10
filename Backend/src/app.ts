import express from "express";
import user_route from "./routes/user_route";
import cors from "cors";
import data_route from "./routes/data_route";
import login_route from "./routes/login_route";
import { request_logger } from "./utils/middleware/request_logger";
import { get_all_prices } from "./services/data_service";
import { Electricity_Price } from "./utils/types/electricity_prices_type";

const app = express();

export let prices: Error | Electricity_Price[];

get_all_prices().then((res) => {
  prices = res;
});

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.use("/api/data", data_route);
app.use("/api/login", login_route);
app.use("/api/user", user_route);

// app.get("/*", (_req, res) => {
//   res.sendFile("/index.html", { root: "./dist" });
// });

app.use(request_logger);

export default app;
