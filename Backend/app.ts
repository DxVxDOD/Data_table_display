import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.get("/*", (_req, res) => {
  res.sendFile("/index.html", { root: "./dist" });
});
