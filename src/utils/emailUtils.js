const sgMail = require("@sendgrid/mail");
const AppError = require("./AppError");

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

exports.sendEmail = async (emailObj) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new AppError("SendGrid API key is not configured", 500);
    }

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

    if (error.isOperational) {
      throw error;
    }

    throw new AppError(error.message, 500);
  }
};
