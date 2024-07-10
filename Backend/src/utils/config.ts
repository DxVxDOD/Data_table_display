import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;

const CRED_DB =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_CRED_DB
    : process.env.CRED_DB;

export { CRED_DB, PORT };
