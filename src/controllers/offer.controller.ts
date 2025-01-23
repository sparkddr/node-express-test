// const createUserSchema = z.object({
//   name: z
//     .string()
//     .min(2, "Le nom doit contenir au moins 2 caractères")
//     .max(50, "Le nom ne doit pas dépasser 50 caractères")
//     .optional(),
//   email: z.string().email("Format d'email invalide").optional(),
//   password: z.string().min(8),
// });
import { Request, Response } from "express";

import OfferModel from "../models/offer.model";

export const getOffers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await OfferModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });
    const totalUsers = await OfferModel.countDocuments();
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
