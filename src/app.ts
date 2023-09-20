import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { validate } from "./utils/validate.js";
import { postMailBodyValidationSchema } from "./dto.js";
import { sendEmails } from "./mailer/mailer.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.get("/health-check", (_, res) => {
  return res.status(200).send();
});

app.post("/mail", async (req, res) => {
  const [parsedBody, error] = validate(req.body, postMailBodyValidationSchema);

  if (error !== null) {
    return res.status(400).json(error);
  }
  try {
    const result = await sendEmails(parsedBody);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server listening on Port", PORT);
});
