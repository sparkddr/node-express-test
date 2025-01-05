import {Request,Response} from 'express'
import UserModel from '../models/user.model'
import { z } from 'zod';
import mongoose from 'mongoose';

const updateUserSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom ne doit pas dépasser 50 caractères").optional(),
    email: z.string().email("Format d'email invalide").optional(),
    // // Ajoutez ici les autres champs optionnels avec leurs validations
    // age: z.number().int("L'âge doit être un nombre entier").positive("L'âge doit être positif").optional(),
    // isActive: z.boolean().optional(),
    // // Exemple avec un enum
    // role: z.enum(["admin", "user", "moderateur"], {invalid_type_error: "Le role doit être 'admin', 'user' ou 'moderateur'"}).optional(),
    // //...s
}).strict();

const getUsers = async (req : Request, res: Response)=>{
    console.log('usermodelcollection',UserModel.collection.name);
    try {
        const users = await UserModel.find()
        res.status(200).json(users)
    }catch (error){
        console.error("Erreur lors de la récupération des utilisateurs", error)
        res.status(500).json({error :error, message:"Erreur serveur" })
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // Validation de l'ID : très important pour éviter les erreurs et les failles de sécurité
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur par ID :", error);
        res.status(500).json({ error: error, message: "Erreur serveur" });
    }
};

const getUsersByName = async (req:Request , res:Response)=>{
    try{
        const searchTerm = req.query.name 
        console.log("search term",searchTerm);
        
        if (typeof searchTerm !== 'string') {
            return res.status(400).json({ message: "Le paramètre 'name' est invalide ou manquant." });
        }
        if (!searchTerm) {
            return res.status(400).json({ message: "Terme de recherche manquant" });
        }
        // Utilisation d'une expression régulière pour une recherche insensible à la casse
        const user = await UserModel.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
        return res.status(200).json(user)


    }catch(error){
        console.error("Erreur lors de la recherche d'utilisateurs : ", error);
        res.status(500).json({ message: "Erreur serveur", error });        
    }
}

const createUser = async (req:Request, res:Response)=>{
    try{
        const newUser = new UserModel(req.body)
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }catch(error){
        console.error("Erreur lors de la création de l'utilisateur")
        res.status(400).json({message : "Données invalides"})
    }
}

const updateUser = async (req:Request, res:Response)=>{
    try{
        const userId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }

        //validation Zod
        const validatedData = updateUserSchema.safeParse(req.body); 
        if (!validatedData.success) {
            // Gérer les erreurs de validation Zod
            const formattedErrors = validatedData.error.errors.map(error => ({
                path: error.path.join('.'), // Convertit le tableau en chaîne
                message: error.message,
            }));
            return res.status(400).json({ errors: formattedErrors });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(updatedUser);
    }catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        res.status(400).json({ message: "Données invalides" });
    }
}

const deleteUser = async (req : Request, res : Response )=>{
    try{
        const userId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }
        const deletedUser = await UserModel.findByIdAndDelete(userId)
        return res.status(204).json(deletedUser)

    }catch (error){
        console.error("Erreur lors de la suppression de l'utilisateur")
        res.status(400).json({ error: error, message: "Erreur lors de la suppression de l'utilisateur" })
    }
}


export {getUsers,getUserById,createUser,updateUser,deleteUser,getUsersByName}