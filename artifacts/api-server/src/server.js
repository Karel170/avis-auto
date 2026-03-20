import express from "express";
import cors from "cors";
import pkg from "pg"; const { Pool } = pkg;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "avisauto-dev-secret";
const db = new Pool({ connectionString: process.env.DATABASE_URL });

app.set("trust proxy", 1);
app.use(cors({ origin: ["https://avis-auto-avisauto.vercel.app", "http://localhost:5173"], credentials: true, methods: ["GET","POST","PUT","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json());

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return res.status(401).json({ error: "Non autorise" });
  try { req.user = jwt.verify(h.substring(7), JWT_SECRET); next(); }
  catch { res.status(401).json({ error: "Token invalide" }); }
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, companyName } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Champs manquants" });
    const existing = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length) return res.status(400).json({ error: "Email deja utilise" });
    const hash = await bcrypt.hash(password, 12);
    const user = await db.query("INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,'user') RETURNING id,email,name,role,created_at", [email, hash, name]);
    let company = null;
    if (companyName) {
      const c = await db.query("INSERT INTO companies (owner_id, name, signature) VALUES ($1,$2,$3) RETURNING *", [user.rows[0].id, companyName, "L equipe de " + companyName]);
      company = c.rows[0];
    }
    const token = jwt.sign({ userId: user.rows[0].id, role: "user" }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ user: user.rows[0], company, token });
  } catch(err) { console.error(err); res.status(500).json({ error: "Erreur serveur" }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!result.rows.length) return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    const company = await db.query("SELECT * FROM companies WHERE owner_id=$1 LIMIT 1", [user.id]);
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    const { password_hash, ...userClean } = user;
    res.json({ user: userClean, company: company.rows[0] || null, token });
  } catch(err) { console.error(err); res.status(500).json({ error: "Erreur serveur" }); }
});

app.get("/api/auth/me", auth, async (req, res) => {
  try {
    const user = await db.query("SELECT id,email,name,role,created_at FROM users WHERE id=$1", [req.user.userId]);
    if (!user.rows.length) return res.status(404).json({ error: "Non trouve" });
    const company = await db.query("SELECT * FROM companies WHERE owner_id=$1 LIMIT 1", [req.user.userId]);
    res.json({ user: user.rows[0], company: company.rows[0] || null });
  } catch(err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.get("/api/companies/:id/stats", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const total = await db.query("SELECT COUNT(*) FROM reviews WHERE company_id=$1", [id]);
    const pending = await db.query("SELECT COUNT(*) FROM reviews WHERE company_id=$1 AND status='nouveau'", [id]);
    const avg = await db.query("SELECT AVG(rating) FROM reviews WHERE company_id=$1", [id]);
    res.json({ total: parseInt(total.rows[0].count), pending: parseInt(pending.rows[0].count), avgRating: parseFloat(avg.rows[0].avg) || 0 });
  } catch(err) { console.error(err); res.status(500).json({ error: "Erreur serveur" }); }
});

app.get("/api/companies/:id/reviews", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const limit = req.query.limit || 20;
    const reviews = await db.query("SELECT * FROM reviews WHERE company_id=$1 ORDER BY created_at DESC LIMIT $2", [id, limit]);
    res.json({ reviews: reviews.rows, total: reviews.rows.length });
  } catch(err) { console.error(err); res.status(500).json({ error: "Erreur serveur" }); }
});

app.post("/api/companies/:id/sync", auth, async (req, res) => {
  try {
    const company = await db.query("SELECT * FROM companies WHERE id=$1", [req.params.id]);
    if (!company.rows.length) return res.status(404).json({ error: "Non trouve" });
    const url = company.rows[0].apify_dataset_url || process.env.APIFY_DATASET_URL;
    if (!url) return res.status(400).json({ error: "URL Apify manquante" });
    const response = await fetch(url);
    const reviews = await response.json();
    let newCount = 0;
    for (const r of reviews) {
      const externalId = r.reviewId || `${r.name}-${r.publishedAtDate}`;
      const exists = await db.query("SELECT id FROM reviews WHERE external_id=$1", [externalId]);
      if (exists.rows.length) continue;
      await db.query("INSERT INTO reviews (company_id, author_name, rating, text, publish_date, external_id, status) VALUES ($1,$2,$3,$4,$5,$6,'nouveau')", [req.params.id, r.name || "Anonyme", r.stars || r.rating || 3, r.text || "", r.publishedAtDate || null, externalId]);
      newCount++;
    }
    res.json({ newReviews: newCount, total: reviews.length, message: `${newCount} nouveaux avis importes` });
  } catch(err) { console.error(err); res.status(500).json({ error: "Erreur serveur" }); }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server on port ${port}`));

