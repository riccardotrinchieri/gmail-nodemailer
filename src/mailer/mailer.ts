import { PostMailDTO } from "@app/dto.js";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const OAuth2 = google.auth.OAuth2;

const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT;
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

// console.log(
//   GMAIL_ACCOUNT,
//   GMAIL_CLIENT_ID,
//   GMAIL_CLIENT_SECRET,
//   GMAIL_REFRESH_TOKEN,
//   GMAIL_ACCESS_TOKEN
// );

const oauth2Client = new OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN,
});

const getAccessToken = () =>
  new Promise<string>((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token");
        return;
      }
      if (!token) {
        reject("Empty access token");
        return;
      }

      resolve(token);
    });
  });

const makeTransporter = async () => {
  const accessToken = await getAccessToken();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: GMAIL_ACCOUNT,
      accessToken,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
    },
  });
};

export const sendEmails = async (sendEmailsDTO: PostMailDTO) => {
  const transporter = await makeTransporter();
  return transporter.sendMail({
    from: GMAIL_ACCOUNT,
    to: sendEmailsDTO.addresses,
    subject: sendEmailsDTO.subject,
    text: sendEmailsDTO.content,
  });
};
