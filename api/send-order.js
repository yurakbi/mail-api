import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://khaby-web-store.vercel.app')
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Додаємо всі потрібні поля
  const { name, surname, email, phone, address, comment, productName, price, color, size, quantity } = req.body;

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
      text: 
        `Ім'я: ${name}\n` +
        `Прізвище: ${surname}\n` +
        `Email: ${email}\n` +
        `Телефон: ${phone}\n` +
        `Адреса: ${address}\n` +
        `Товар: ${productName}\n` +
        `Ціна: ${price}\n` +
        `Колір: ${color}\n` +
        `Розмір: ${size}\n` +
        `Кількість: ${quantity}\n` +
        (comment ? `Коментар: ${comment}\n` : '')
    });
    res.status(200).json({ message: "Лист відправлено!" });
  } catch (error) {
    res.status(500).json({ message: "Помилка при відправці листа" });
  }
}