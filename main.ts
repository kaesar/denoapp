import express, { Request, Response } from "npm:express@5";
import { MongoClient } from "npm:mongodb";

//const dbuser: string = Deno.env.get("DB_USER") || "root";
//const dbpass: string = Deno.env.get("DB_PASS") || "password";
const dbname: string = Deno.env.get("DB_NAME") || "demo";
const dbport: number = Number(Deno.env.get("DB_PORT")) || 27027;
const dbhost: string = Deno.env.get("DB_HOST") || "localhost";
//const mongoUri = `mongodb://${dbuser}:${dbpass}@${dbhost}:${dbport}`;
const mongoUri = `mongodb://${dbhost}:${dbport}`;
const client = new MongoClient(mongoUri);

const port: number = Number(Deno.env.get("RUN_PORT")) || 3000;
const app = express();

async function connectMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting with MongoDB", err);
  }
}

connectMongoDB();

app.get("/", (req: Request, res: Response) => {
  return res.send("Hi there!");
});

app.get("/data", async (req: Request, res: Response) => {
  try {
    const db = client.db(dbname);
    const collection = db.collection("messages");

    const data = { name: "John", message: "Oki" };
    await collection.updateOne({ name: data.name }, { $setOnInsert: data }, { upsert: true });

    const messages = await collection.find({}).toArray();

    return res.json(messages);
  } catch (err) {
    console.error("Error getting data", err);
    return res.status(500).json({ error: "Error getting data" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
