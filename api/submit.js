// /api/submit.js
import { Client } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { fullname, email, phone, course, message } = req.body || {};
  if (!fullname || !email || !phone || !course) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Basic spam guard (super simple)
  if (fullname.length > 120 || email.length > 120 || phone.length > 20 || (message || "").length > 2000) {
    return res.status(400).json({ error: "Input too long" });
  }

  const client = new Client(process.env.DATABASE_URL);
  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        fullname TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        course TEXT NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(
      `INSERT INTO registrations (fullname, email, phone, course, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [fullname, email, phone, course, message || null]
    );

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  } finally {
    await client.end();
  }
}
