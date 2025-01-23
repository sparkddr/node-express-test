const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company", // Important: référence au modèle Company (si vous en avez un)
    },
    appliedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Important: référence au modèle Student (si vous en avez un)
      },
    ],
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
    contactCompany: {
      type: Boolean,
      default: false,
    },
    startDate: Date,
    endDate: Date,
    alternanceTempo: {
      type: String,
      // required: true, // À définir avec Nicolas (ajouter les valeurs enum une fois définies)
      // enum: ['Valeur1', 'Valeur2', 'Valeur3'], // Exemple
    },
    expectedDuration: String,
    flexibleStartDate: {
      type: Boolean,
      default: false,
    },
    educationLevel: String,
    remoteWork: {
      type: Boolean,
      default: false,
    },
    remoteWorkFrequency: String,
    requiredLanguages: [String],
    skills: {
      soft: [String],
      hard: [String],
    },
    applicationInstructions: {
      channelType: {
        type: String,
        enum: ["viaCompanySite", "viaEmail", "viaPlatform"],
        required: true,
      },
      companySiteUrl: String,
      contactEmail: String,
    },
    openToRqthProfiles: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // Ajoute automatiquement createdAt et updatedAt

const OfferModel = mongoose.model("Offer", offerSchema);
export default OfferModel;

// offerSchema.index({ "address.geolocation": "2dsphere" }); // Index géospatial
