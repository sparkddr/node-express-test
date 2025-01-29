import { Schema, model, Document, Types } from "mongoose";
import {
  Offer,
  OFFER_STATUS,
  ALTERNANCE_TEMPO,
  EXPECTED_DURATION,
  EDUCATION_LEVEL,
} from "../type/offer.types";

type OfferDocument = Offer & Document;

const offerSchema = new Schema<OfferDocument>(
  {
    status: {
      type: String,
      enum: OFFER_STATUS,
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Company", // Important: référence au modèle Company
    },
    // appliedStudents: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Student", // Important: référence au modèle Student (si vous en avez un)
    //   },
    // ],
    specialty: {
      // "Métiers"
      type: String,
      required: true, // À définir avec Nicolas (ajouter les valeurs enum une fois définies)
      // enum: ['Valeur1', 'Valeur2', 'Valeur3'], // Exemple
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    companyIndustry: {
      type: String,
      required: true,
    },
    contractType: {
      type: String,
      required: true,
    },
    address: {
      // "adress" (correction orthographique)
      postalCode: String,
      city: String,
      geolocation: {
        // "geolocalisation" (correction orthographique)
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0],
        },
      },
    },
    alternanceTempo: {
      type: String,
      enum: ALTERNANCE_TEMPO,
      required: true,
    },
    // contactCompany: {
    //   type: Boolean,
    //   default: false,
    // },
    // startDate: Date,
    // endDate: Date,
    // alternanceTempo: {
    //   type: String,
    //   // required: true, // À définir avec Nicolas (ajouter les valeurs enum une fois définies)
    //   // enum: ['Valeur1', 'Valeur2', 'Valeur3'], // Exemple
    // },
    expectedDuration: {
      type: String,
      enum: EXPECTED_DURATION,
      required: true,
    },
    // flexibleStartDate: {
    //   type: Boolean,
    //   default: false,
    // },
    educationLevel: {
      type: String,
      enum: EDUCATION_LEVEL,
      required: true,
    },
    // remoteWork: {
    //   type: Boolean,
    //   default: false,
    // },
    // remoteWorkFrequency: String,
    // requiredLanguages: [String],
    skills: {
      soft: [String],
      hard: [String],
    },
    // applicationInstructions: {
    //   channelType: {
    //     type: String,
    //     enum: ["viaCompanySite", "viaEmail", "viaPlatform"],
    //     required: true,
    //   },
    //   companySiteUrl: String,
    //   contactEmail: String,
    // },
    // openToRqthProfiles: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
); // Ajoute automatiquement createdAt et updatedAt

// Déplacer les index avant la création du modèle
offerSchema.index({ jobTitle: 1 });
offerSchema.index({ "address.geolocation": "2dsphere" });

const OfferModel = model<Offer>("Offer", offerSchema);
export default OfferModel;
