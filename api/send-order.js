import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, address, comment } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Нове замовлення",
      text: `Ім'я: ${name}\nEmail: ${email}\nТелефон: ${phone}\nАдреса: ${address}\nКоментар: ${comment}`,
    });
    res.status(200).json({ message: "Лист відправлено!" });
  } catch (error) {
    res.status(500).json({ message: "Помилка при відправці листа" });
  }
}