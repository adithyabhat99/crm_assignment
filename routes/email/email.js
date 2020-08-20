module.exports = (email, subject, text) => {
  const mailer = require("nodemailer");
  const config = require("./email_config");

  const transporter = mailer.createTransport(config);

  const mailOptions = {
    from: "roofandbunk@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error sending mail");
      console.log(error)
    } else console.log("Email Sent");
  });
};
