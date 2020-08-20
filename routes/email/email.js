const mailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const transporter = mailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

module.exports = (email, subject, text) => {
  const mailOptions = {
    from: "roofandbunk@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("ERROR SENDING MAIL");
      console.log(error);
    } else console.log("EMAIL SENT");
  });
};
