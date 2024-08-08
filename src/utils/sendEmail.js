import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "emy.mostafa.7op@gmail.com",
        pass: "dqszuknhliqnvchq",
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Mostafa Tito 👻" <"emy.mostafa.7op@gmail.com">', // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
