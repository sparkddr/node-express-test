require('dotenv').config()
import express, { Request, Response } from 'express';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import userRoutes from './routes/users.routes'

const uri = process.env.MONGODB_URI
if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

console.log('url', uri);



const app = express();
const port = process.env.PORT || 3000

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db: Db | null = null

const connectToDatabase = async () => {
    try {
        await mongoose.connect(uri); // Utilisez mongoose.connect()
        console.log("Connecté à MongoDB avec Mongoose !");
    } catch (error) {
        console.error("Erreur de connexion à MongoDB :", error);
        process.exit(1);
    }
}

async function startServer() {
    const database = await connectToDatabase();
    app.locals.db = database;
    app.use(express.json());
    app.use('/users', userRoutes)
    app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
    });
}

startServer();



app.get('/', (req: Request, res: Response) => {
    res.send(("Bienvenue sur l'API + refresh"))
})


app.post('/api/data', (req: Request, res: Response) => {
    console.log(req.body);
    res.json({ message: 'Données reçues avec succès', data: req.body })
})

