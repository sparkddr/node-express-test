import { Request, Response } from "express";
import CityModel from "../models/city.model";

const getCities = async (req: Request, res: Response) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { cityName: { $eq: search } },
        { cityName: { $regex: `^${search}`, $options: "i" } },
        { postalCode: { $regex: search, $options: "i" } },
      ],
    };
  }

  try {
    const cities = await CityModel.find(query).limit(15);
    res.status(200).json(cities);
  } catch (error) {
    console.error("Erreur lors de la récupération des villes:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des villes" });
  }
};

export { getCities };
