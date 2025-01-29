require("dotenv").config();

import mongoose from "mongoose";
import { createFakeUser } from "./seed";
import OfferModel from "../src/models/offer.model";
import User from "../src/models/userbis.model";

async function seedUsers() {
  try {
    console.log("🔄 Récupération des IDs des offres...");
    const offerIds = await OfferModel.find({})
      .select("_id")
      .then((offers) => offers.map((o) => o._id));

    console.log("🔄 Création des utilisateurs...");
    const users = await Promise.all(
      Array.from({ length: 100 }, () => createFakeUser(offerIds))
    );

    console.log("🔄 Effacement des anciens utilisateurs...");
    await User.deleteMany({});

    console.log("🔄 Insertion des nouveaux utilisateurs...");
    await User.insertMany(users);

    console.log("✅ Utilisateurs créés avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des utilisateurs:", error);
  }
}

async function main() {
  await mongoose.connect(process.env.MONGODB_LOCAL || "");
  console.log("✅ Connexion à MongoDB établie");
  await seedUsers();
  await mongoose.connection.close();
  console.log("👋 Connexion à MongoDB fermée");
}

main();
