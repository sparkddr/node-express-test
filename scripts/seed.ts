require("dotenv").config();

import mongoose from "mongoose";
import { Faker, fr } from "@faker-js/faker";
import OfferModel from "../src/models/offer.model";
import CityModel from "../src/models/city.model";
import User from "../src/models/userbis.model";
import {
  ALTERNANCE_TEMPO,
  CONTRACT_TYPE,
  EDUCATION_LEVEL,
  EXPECTED_DURATION,
  Offer,
  OFFER_STATUS,
} from "../src/type/offer.types";

type FrenchCity = {
  city: string;
  postalCode: string;
  coordinates: [number, number];
};

export const frenchCities: FrenchCity[] = [
  { city: "Paris", postalCode: "75000", coordinates: [2.3522, 48.8566] },
  { city: "Lyon", postalCode: "69000", coordinates: [4.8357, 45.764] },
  { city: "Marseille", postalCode: "13000", coordinates: [5.3698, 43.2965] },
  { city: "Bordeaux", postalCode: "33000", coordinates: [-0.5792, 44.8378] },
  { city: "Lille", postalCode: "59000", coordinates: [3.0573, 50.6292] },
  { city: "Nantes", postalCode: "44000", coordinates: [-1.5534, 47.2184] },
  { city: "Strasbourg", postalCode: "67000", coordinates: [7.7521, 48.5734] },
  { city: "Toulouse", postalCode: "31000", coordinates: [1.4442, 43.6047] },
  { city: "Nice", postalCode: "06000", coordinates: [7.262, 43.7102] },
  { city: "Rennes", postalCode: "35000", coordinates: [-1.6777, 48.1173] },
];

export const softSkills = [
  "Communication",
  "Travail d'équipe",
  "Leadership",
  "Adaptabilité",
  "Organisation",
  "Créativité",
  "Autonomie",
  "Gestion du stress",
  "Esprit critique",
  "Résolution de problèmes",
  "Empathie",
  "Sens de l'initiative",
  "Capacité d'analyse",
  "Sens de l'écoute",
  "Diplomatie",
  "Pédagogie",
  "Rigueur",
  "Polyvalence",
  "Sens des responsabilités",
  "Intelligence émotionnelle",
];

export const industriesFR = [
  "Technologies de l'information",
  "Services financiers",
  "Santé",
  "Éducation",
  "Commerce de détail",
  "Industrie manufacturière",
  "Conseil",
  "Marketing et publicité",
  "Immobilier",
  "Transport et logistique",
  "Énergie",
  "Télécommunications",
  "Médias",
  "Hôtellerie et restauration",
  "Construction",
  "Agriculture",
];

export const hardSkills = [
  "React",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Python",
  "Java",
  "SQL",
  "AWS",
  "Docker",
  "Git",
  "PHP",
  "Angular",
  "Vue.js",
  "Swift",
  "Kotlin",
  "C++",
  "C#",
  "Ruby",
  "Scala",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe InDesign",
  "AutoCAD",
  "Revit",
  "SketchUp",
  "Excel",
  "PowerBI",
  "Tableau",
  "R",
  "SPSS",
  "SAS",
  "SAP",
  "Salesforce",
  "WordPress",
  "SEO",
  "Google Analytics",
  "Social Media Marketing",
  "Content Marketing",
  "Email Marketing",
  "PLC Programming",
  "SCADA",
  "Robotics",
  "3D Printing",
  "CNC Programming",
  "Lean Manufacturing",
  "Six Sigma",
  "ISO Standards",
  "HACCP",
  "GMP",
  "BIM",
  "PRINCE2",
  "Agile",
  "Scrum",
  "Project Management",
  "Budgeting",
  "Financial Analysis",
  "Risk Management",
  "Quality Control",
  "Supply Chain Management",
  "Logistics",
  "Inventory Management",
  "Customer Service",
  "Negotiation",
  "Contract Management",
  "Business Development",
  "Market Research",
  "Public Relations",
  "Human Resources",
  "Recruitment",
  "Training & Development",
  "Performance Management",
  "Change Management",
  "Operations Management",
  "Process Improvement",
  "Strategic Planning",
  "Business Analysis",
  "Data Analysis",
  "Research Methods",
  "Technical Writing",
  "Medical Terminology",
  "Clinical Research",
  "Laboratory Techniques",
  "Accounting",
  "Auditing",
  "Tax Planning",
  "Cost Analysis",
  "Procurement",
  "Vendor Management",
  "Event Planning",
  "Crisis Management",
  "Conflict Resolution",
  "Team Leadership",
  "Mentoring",
];

export const faker = new Faker({ locale: [fr] });

async function createFakeOffer(): Promise<Offer> {
  const randomCity = faker.helpers.arrayElement(frenchCities);

  return {
    status: faker.helpers.arrayElement(OFFER_STATUS),
    companyId: new mongoose.Types.ObjectId(),
    specialty: faker.person.jobArea(),
    jobTitle: faker.person.jobTitle(),
    jobDescription: faker.lorem.paragraph(),
    alternanceTempo: faker.helpers.arrayElement(ALTERNANCE_TEMPO),
    educationLevel: faker.helpers.arrayElement(EDUCATION_LEVEL),
    expectedDuration: faker.helpers.arrayElement(EXPECTED_DURATION),
    companyIndustry: faker.helpers.arrayElement(industriesFR),
    contractType: faker.helpers.arrayElement(CONTRACT_TYPE),
    address: {
      postalCode: randomCity.postalCode,
      city: randomCity.city,
      geolocation: {
        type: "Point",
        coordinates: randomCity.coordinates,
      },
    },
    skills: {
      soft: faker.helpers.arrayElements(softSkills, { min: 3, max: 4 }),
      hard: faker.helpers.arrayElements(hardSkills, { min: 2, max: 5 }),
    },
  };
}

export type UserFake = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role:
    | "admittedStudent"
    | "enrolledStudent"
    | "companyEmployee"
    | "referent"
    | "admin";
  createdAt: Date;
  updatedAt: Date;
  student?: {
    profile: {
      address: {
        postalCode: string;
        city: string;
        location: {
          type: "Point";
          coordinates: [number, number]; // [longitude, latitude]
        };
      };
      businessSector: Array<
        | "informatique"
        | "marketing"
        | "finance"
        | "commercial"
        | "ressources_humaines"
        | "juridique"
        | "sante"
        | "education"
        | "industrie"
        | "logistique"
        | "communication"
        | "immobilier"
        | "tourisme"
        | "agroalimentaire"
        | "environnement"
        | "automobile"
        | "construction"
        | "consulting"
        | "medias"
        | "rechercheDeveloppement"
      >;
    };
    savedSearches: mongoose.Types.ObjectId[];
    savedOffers: mongoose.Types.ObjectId[];
    appliedOffers: mongoose.Types.ObjectId[];
    settings: any; // À typer plus précisément selon les paramètres de notification
  };
  companyEmployee?: {
    profile: any; // À typer plus précisément selon la structure du profil
    companyId: mongoose.Types.ObjectId;
    affiliatedCompanies: mongoose.Types.ObjectId[];
    savedSearches: mongoose.Types.ObjectId[];
    settings: any; // À typer plus précisément selon les paramètres de notification
  };
  referent?: {
    profile: any; // À typer plus précisément selon la structure du profil
    settings: any; // À typer plus précisément selon les paramètres de notification
  };
};

export const USER_ROLE = [
  "admittedStudent",
  "enrolledStudent",
  // "companyEmployee",
  // "referent",
  // "admin",
] as const;

async function createFakeUser(
  offerIds: mongoose.Types.ObjectId[]
): Promise<UserFake> {
  const role = faker.helpers.arrayElement(USER_ROLE);

  const user: UserFake = {
    username: faker.person.firstName(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    role,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  if (role === "admittedStudent" || role === "enrolledStudent") {
    user.student = {
      profile: {
        address: {
          postalCode: faker.location.zipCode(),
          city: faker.location.city(),
          location: {
            type: "Point",
            coordinates: [0, 0],
          },
        },
        businessSector: faker.helpers.arrayElements(
          [
            "informatique",
            "consulting",
            "rechercheDeveloppement",
            "marketing",
            "finance",
          ],
          faker.number.int({ min: 1, max: 3 })
        ),
      },
      savedSearches: faker.helpers
        .shuffle(offerIds)
        .slice(0, faker.number.int({ min: 1, max: 3 })),
      savedOffers: faker.helpers
        .shuffle(offerIds)
        .slice(0, faker.number.int({ min: 20, max: 50 })),
      appliedOffers: faker.helpers
        .shuffle(offerIds)
        .slice(0, faker.number.int({ min: 34, max: 76 })),
      settings: {
        notifications: {
          email: faker.datatype.boolean(),
          push: faker.datatype.boolean(),
          frequency: faker.helpers.arrayElement(["daily", "weekly", "monthly"]),
        },
      },
    };
  }

  // if (role === "companyEmployee") {
  //   user.companyEmployee = {
  //     profile: {
  //       position: faker.person.jobTitle(),
  //     },
  //     companyId: new mongoose.Types.ObjectId(),
  //     affiliatedCompanies: faker.helpers
  //       .shuffle(offerIds)
  //       .slice(0, faker.number.int({ min: 1, max: 3 })),
  //     savedSearches: faker.helpers
  //       .shuffle(offerIds)
  //       .slice(0, faker.number.int({ min: 1, max: 3 })),
  //     settings: {
  //       notifications: {
  //         email: faker.datatype.boolean(),
  //         push: faker.datatype.boolean(),
  //         frequency: faker.helpers.arrayElement(["daily", "weekly", "monthly"]),
  //       },
  //     },
  //   };
  // }

  // if (role === "referent") {
  //   user.referent = {
  //     profile: {
  //       department: faker.location.state(),
  //     },
  //     settings: {
  //       notifications: {
  //         email: faker.datatype.boolean(),
  //         push: faker.datatype.boolean(),
  //         frequency: faker.helpers.arrayElement(["daily", "weekly", "monthly"]),
  //       },
  //     },
  //   };
  // }

  return user;
}

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

async function seedOffers() {
  const startTime = Date.now();

  try {
    // Crée les offres avec les vrais IDs de companies
    console.log("🔄 Génération des offres en cours...");
    const fakeOffers = await Promise.all(
      Array.from({ length: 40000 }, () => createFakeOffer())
    );

    // Supprime les anciennes offres
    console.log("🗑️  Suppression des anciennes offres...");
    await OfferModel.deleteMany({});

    // Insère les nouvelles offres
    console.log("📥 Insertion des nouvelles offres...");
    const offers = await OfferModel.insertMany(fakeOffers);

    const executionTime = (Date.now() - startTime) / 1000; // Conversion en secondes
    console.log(
      `✨ ${offers.length} offres générées et insérées en ${executionTime} secondes`
    );

    // Log quelques exemples pour vérification
    console.log("\n📋 Exemple d'offres créées:");
    console.log(
      offers.slice(0, 2).map((offer) => ({
        id: offer._id,
        jobTitle: offer.jobTitle,
        city: offer.address.city,
        coordinates: offer.address.geolocation.coordinates,
      }))
    );
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
  }
}

async function seedCities() {
  try {
    // Lire le fichier JSON des villes
    const citiesData = require("../data/jobboard_poc.cities.json");

    console.log("🔄 Suppression des anciennes villes...");
    await CityModel.deleteMany({});

    console.log("🔄 Insertion des nouvelles villes...");
    await CityModel.insertMany(citiesData);

    console.log(`✨ ${citiesData.length} villes insérées avec succès`);
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des villes:", error);
  }
}

// Modification de la fonction principale pour inclure le seed des villes
async function main() {
  await mongoose.connect(process.env.MONGODB_LOCAL || "");
  console.log("✅ Connexion à MongoDB établie");

  await seedOffers();
  await seedCities();
  await new Promise((resolve) => setTimeout(resolve, 4000)); // Petit délai pour s'assurer que les offres sont bien enregistrées
  await seedUsers();
  await mongoose.connection.close();
  console.log("👋 Connexion à MongoDB fermée");
}

main();

export { createFakeUser, seedUsers, seedOffers, seedCities };
