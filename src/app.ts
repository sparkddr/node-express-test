import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req : Request, res : Response)=>{
    res.send(("Bienvenue sur l'API"))
})

app.post('/api/data' , (req: Request,res : Response)=>{
    console.log(req.body);
    res.json({message : 'Données reçues avec succès', data : req.body})
})

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });