import { Request, Response } from "express";

import OfferModel from "../models/offer.model";
import mongoose from "mongoose";

export const getOffers = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search as string;
  const educationLevels = (req.query["educationLevel[]"] ||
    req.query.educationLevel) as string[] | undefined;
  const duration = req.query.duration as string[] | undefined;
  // Paramètres pour la recherche géospatiale
  const longitude = parseFloat(req.query.longitude as string);
  const latitude = parseFloat(req.query.latitude as string);
  const maxDistance = parseInt(req.query.maxDistance as string) || 10;

  console.log("Query params reçus:", req.query);

  try {
    let query: Record<string, any> = {};

    // Ajouter le filtre de recherche texte si fourni
    if (search) {
      query = {
        ...query,
        jobTitle: { $regex: search, $options: "i" },
      };
    }
    // Ajouter le filtre pour les niveaux d'éducation si fourni
    if (
      educationLevels &&
      educationLevels?.length > 0 &&
      educationLevels?.[0] !== undefined
    ) {
      query = {
        ...query,
        educationLevel: { $in: educationLevels },
      };
    }
    if (duration && duration?.length > 0 && duration?.[0] !== undefined) {
      query = {
        ...query,
        expectedDuration: { $in: duration },
      };
    }

    // Ajouter le filtre géospatial si les coordonnées sont fournies
    if (!isNaN(longitude) && !isNaN(latitude)) {
      if (!isNaN(longitude) && !isNaN(latitude)) {
        query["address.geolocation"] = {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], maxDistance / 6378.1], // Rayon en radians
          },
        };
      }
    }

    const offers = await OfferModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const totalOffers = await OfferModel.countDocuments(query);

    const queryTime = Date.now() - startTime;
    console.log(`Recherche effectuée en ${queryTime}ms`);

    res.status(200).json({
      data: offers,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(totalOffers / limit),
      totalOffers,
    });
  } catch (error: any) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

export const getOfferById = async (req: Request, res: Response) => {
  const offerId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ message: "ID offre invalide" });
    }

    const offer = await OfferModel.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ error: error, message: "Erreur serveur" });
  }
};
