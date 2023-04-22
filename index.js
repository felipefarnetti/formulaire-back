const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuration MailGUN //
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Felipe Farnetti",
  key: process.env.MAILGUN_API_KEY,
});

// ROUTES //

app.get("/", (req, res) => {
  console.log("route /");
  res.status(200).json("Welcome");
});

app.post("/form", async (req, res) => {
  console.log("route /form");
  try {
    const { firstname, lastname, email, subject, message } = req.body;

    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: "felipefarnetti@gmail.com",
      subject: subject,
      text: message,
    };

    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
