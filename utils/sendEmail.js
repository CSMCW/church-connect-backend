require('dotenv').config();
const nodemailer = require('nodemailer');
const mailGen = require('mailgen');

const sendEmail = async (mailParameters) => {
  try {
    // create Transporter
    const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailGenerator = new mailGen({
      theme: 'default',
      product: {
        name: 'Church Connect',
        link: 'https://developmentserverislocalhost.com/',
      },
    });

    const email = {
      body: {
        name: mailParameters.name,
        intro:
          `Thank you for choosing Church connect, you recieved this email because ` +
          mailParameters.reason,
        action: mailParameters.action || null,
        outro:
          'Need help or have questions? Just reply to this mail and we will be glad to help you.',
      },
    };

    const emailHtml = mailGenerator.generate(email);
    const emailText = mailGenerator.generatePlaintext(email);

    //  Define the Mail mailParameters
    const message = {
      from: process.env.EMAIL_USERNAME,
      to: mailParameters.reciever,
      subject: mailParameters.subject,
      text: emailText,
      html: emailHtml,
    };

    //   Send the mail
    return await mailTransporter.sendMail(message);
  } catch (error) {
    console.error('Error from sendEmail:', error.messa);
    throw error;
  }
};

module.exports = { sendEmail };
