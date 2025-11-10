// /api/admin-list.js
import { Client } from "@neondatabase/serverless";

export default async function handler(req, res) {
  const token = req.query.token;
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const client = new Client(process.env.DATABASE_URL);
  try {
    await client.connect();
    const { rows } = await client.query(
      "SELECT id, fullname, email, phone, course, message, created_at FROM registrations ORDER BY created_at DESC LIMIT 200;"
    );
    return res.status(200).json({ count: rows.length, items: rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  } finally {
    await client.end();
  }
}
