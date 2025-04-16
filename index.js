import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors());

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        label TEXT UNIQUE,
        text TEXT DEFAULT NULL
      );
    `);
    await pool.query(`
       INSERT INTO content (label)
       VALUES ('title'), ('subtitle')
       ON CONFLICT (label) DO NOTHING
    `);
    console.log('Table "content" created successfully');
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

createTable();

app.get("/", (req, res) => {
  res.send({ msg: `Test API ${process.env.DB_NAME}` });
});

app.get("/title", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM content WHERE label = $1", [
      "title",
    ]);
    res.send({
      msg: result?.rows[0]?.text || null,
    });
    // Asian Food Delivered Hot & Fresh
  } catch (err) {
    res.send({ msg: err });
  }
});

app.get("/subtitle", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM content WHERE label = $1", [
      "subtitle",
    ]);
    res.send({
      msg: result?.rows[0]?.text || null,
    });
    // Asian Food Delivered Hot & Fresh
  } catch (err) {
    res.send({ msg: err });
  }
});
// "Chefs do all the prep work, like peeding, chopping & marinating, so you can cook a good food.

app.put("/content/:label", async (req, res) => {
  const { label } = req.params;
  const { text } = req.body;

  try {
    const result = await pool.query(
      "UPDATE content SET text = $1 WHERE label = $2 RETURNING *",
      [text, label]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/version", (req, res) => {
  res.send({ msg: "1.0.0" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
