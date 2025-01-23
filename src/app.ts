require("dotenv").config();
import express, { Request, Response } from "express";
import { Db, MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import userRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import offerRoutes from "./routes/offers.routes";
import morgan from "morgan";

const uri = process.env.MONGODB_LOCAL;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

console.log("url", uri);

export const app = express();
const port = process.env.PORT || 3000;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db: Db | null = null;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Remplacez '*' par une origine spécifique si nécessaire
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Méthodes autorisées
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // En-têtes autorisés
  next();
});
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});
app.use(morgan("dev"));
app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/offers", offerRoutes);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri); // Utilisez mongoose.connect()
    console.log("Connecté à MongoDB avec Mongoose !");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

async function startServer() {
  const database = await connectToDatabase();
  app.locals.db = database;
  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

app.get("/", (req: Request, res: Response) => {
  res.send("Bienvenue sur l'API + refresh");
});

app.post("/api/data", (req: Request, res: Response) => {
  console.log(req.body);
  res.json({ message: "Données reçues avec succès", data: req.body });
});
