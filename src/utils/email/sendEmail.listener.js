import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: `${process.env.APP_EMAIL}`,
    pass: `${process.env.APP_PASS}`,
  },
});

export const sendEmail = async (email, htmlTemplate) => {
  await transporter.sendMail({
    from: `"Saraha Application" <${process.env.APP_EMAIL}>`,
    to: `${email}`,
    subject: "Hello from saraha application",
    html: htmlTemplate,
  });
};
