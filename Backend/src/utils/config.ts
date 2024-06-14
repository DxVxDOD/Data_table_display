import dotenv from "dotenv";
dotenv.config();

const { PORT, SECRET } = process.env;

export { PORT, SECRET };
