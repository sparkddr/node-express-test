import jwt from 'jsonwebtoken'
import z from 'zod'
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'ma_clé_secrète_très_longue_et_aléatoire'

const JWT_EXPIRES_IN = '1h';

type JwtPayload = {
    _id: string;
    email: string;
    name: string;
}
export const JwtPayLoadSchema = z.object({
    _id: z.string(), // Pour Types.ObjectId de Mongoose
    email: z.string(),
    name: z.string(),
});


export const generateToken = (payload : JwtPayload): string => {
    console.log(JWT_SECRET);
    return jwt.sign(payload,JWT_SECRET, {expiresIn : JWT_EXPIRES_IN})
}

export const verifyToken = (token: string) : object | null=>{
    try {
        const decoded = jwt.verify(token,JWT_SECRET)
        if (typeof decoded === 'string'){
            throw Error
        }
        return decoded 
    }catch (error){
        return null
    }
}