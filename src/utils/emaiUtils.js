const sgMail = require("@sendgrid/mail");
const { TokenExpiredError } = require("jsonwebtoken");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (emailObj) => {
  try {
    const msg = {
      to: emailObj.to,
      from: "orouk006@gmail.com",
      subject: emailObj.subject,
      text: emailObj.text,
    };

    await sgMail.send(msg);
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
    }

    throw new Error(error.message);
  }
};
