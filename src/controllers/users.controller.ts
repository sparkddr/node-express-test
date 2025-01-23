import { Request, Response } from 'express'
import UserModel from '../models/user.model'
import { z } from 'zod';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;

const updateUserSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom ne doit pas dépasser 50 caractères").optional(),
    email: z.string().email("Format d'email invalide").optional(),
}).strict();

const createUserSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom ne doit pas dépasser 50 caractères").optional(),
    email: z.string().email("Format d'email invalide").optional(),
    password: z.string().min(8)
})

const getUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const users = await UserModel.find().skip(skip).limit(limit).sort({ name: 1 });
        const totalUsers = await UserModel.countDocuments();
        console.log(totalUsers);
        res.status(200).json({
            data: users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // Validation de l'ID 
        if (!mongoose.Types.ObjectId.isValid(userId))  {
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

const getUsersByName = async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.name
        console.log("search term", searchTerm);

        if (typeof searchTerm !== 'string') {
            return res.status(400).json({ message: "Le paramètre 'name' est invalide ou manquant." });
        }
        if (!searchTerm) {
            return res.status(400).json({ message: "Terme de recherche manquant" });
        }
        // Utilisation d'une expression régulière pour une recherche insensible à la casse
        const user = await UserModel.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
        return res.status(200).json(user)


    } catch (error) {
        console.error("Erreur lors de la recherche d'utilisateurs : ", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
}

const getUsersByEmail = async (req: Request, res: Response) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ message: "L'email est requis" });
        }
        const user = await UserModel.find({ email });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
}

const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        //validation Zod
        const validatedData = createUserSchema.safeParse(req.body);
        if (!validatedData.success) {
            // Gérer les erreurs de validation Zod
            const formattedErrors = validatedData.error.errors.map(error => ({
                path: error.path.join('.'), // Convertit le tableau en chaîne
                message: error.message,
            }));
            return res.status(400).json({ errors: formattedErrors });
        }

        // 1. Générer le salt
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        // 2. Hacher le mot de passe avec le salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({ name, email, password: hashedPassword })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error: any) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        if (error.code === 11000 || error.name === 'MongoServerError' && error.message.includes('duplicate key')) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ message: "Erreur serveur lors de la création de l'utilisateur." });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        res.status(400).json({ message: "Données invalides" });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }
        const deletedUser = await UserModel.findByIdAndDelete(userId)
        return res.status(204).json(deletedUser)

    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur")
        res.status(400).json({ error: error, message: "Erreur lors de la suppression de l'utilisateur" })
    }
}

const getProfil = (req: Request, res: Response) => {
        if (!req.user) {
             res.status(300).json({ message: "L'utilisateur n'est pas connecté" })
             
        }
         res.status(200).json({ user: req.user })
         }

export { getUsers, getUserById, createUser, updateUser, deleteUser, getUsersByName, getProfil , getUsersByEmail}