import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { JwtPayLoadSchema } from '../utils/jwt';

// Définition du schéma Zod pour le payload du JWT


// Définition de l'interface pour req.user (plus besoin de l'index signature [key: string]: any)
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                name?: string;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new Error()
        }
        console.log(authHeader);

        const token = authHeader.split(' ')[1];

        console.log(process.env.JWT_SECRET);


        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                req.user = undefined;
                return next(new Error("No token provided"));
            }

            // Validation avec Zod
            const validationResult = JwtPayLoadSchema.safeParse(decoded);

            if (!validationResult.success) {
                console.error("Erreur de validation du JWT:", validationResult.error.errors);
                req.user = undefined;
                return next(new Error("Invalid token format"));
            }

            // Assignation typée de req.user
            req.user = {
                userId: validationResult.data._id,
                email: validationResult.data.email,
                name: validationResult.data.name,
            };

            next();
            return
        })
    } catch (error) {
        console.error("Erreur lors de la vérification du token");
        return next(new Error("Invalid token")); // Utilisation correcte de next(error)
    };
};
