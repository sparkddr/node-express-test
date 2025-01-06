import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/jwt";


export const loginUser = async (req: Request, res: Response) => {
    try{
        const {email,password} = req.body;
        const user =  await UserModel.findOne({email})
        if(!user){
            return res.status(401).json({message: "Email n'existe pas dans la base de donnée"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid){
            return res.status(401).json({message: "Mot de passe invalide"})
        }

        const payload = {
            _id : user._id.toString(),
            email : user.email,
            name : user.name
        }
        const token = generateToken(payload)
        res.json({token})

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }

}