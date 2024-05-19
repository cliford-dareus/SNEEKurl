import { createTestAccount, createTransport } from "nodemailer";

const getConfig = () => {
  let config = {};
  if (process.env.NODE_ENV === "production") {
    config = {
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "real.user",
        pass: "verysecret",
      },
    };
  } else {
    config = {
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "jewel.satterfield@ethereal.email",
        pass: "pys54ww3ACa7EAWDe8",
      },
    };
  }
  return config;
};

export const transporter = async () => {
  const testAccount = await createTestAccount();
  return createTransport(getConfig());
};
