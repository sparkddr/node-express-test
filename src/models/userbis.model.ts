import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
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
}

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [
        "admittedStudent",
        "enrolledStudent",
        "companyEmployee",
        "referent",
        "admin",
      ],
    },
    student: {
      profile: {
        address: {
          // postalCode: {
          //   type: String,
          //   required: true,
          // },
          // city: {
          //   type: String,
          //   required: true,
          // },
          // location: {
          //   type: {
          //     type: String,
          //     enum: ["Point"],
          //     required: true,
          //   },
          //   coordinates: {
          //     type: [Number],
          //     required: true,
          //   },
          // },
        },
        businessSector: [
          {
            type: String,
            enum: [
              "informatique",
              "marketing",
              "finance",
              "commercial",
              "ressources_humaines",
              "juridique",
              "sante",
              "education",
              "industrie",
              "logistique",
              "communication",
              "immobilier",
              "tourisme",
              "agroalimentaire",
              "environnement",
              "automobile",
              "construction",
              "consulting",
              "medias",
              "rechercheDeveloppement",
            ],
          },
        ],
      },
      savedSearches: [{ type: Schema.Types.ObjectId }],
      savedOffers: [
        {
          type: Schema.Types.ObjectId,
          ref: "Offer",
        },
      ],
      appliedOffers: [
        {
          type: Schema.Types.ObjectId,
          ref: "Offer",
        },
      ],
      settings: { type: Schema.Types.Mixed },
    },
    companyEmployee: {
      profile: { type: Schema.Types.Mixed },
      companyId: { type: Schema.Types.ObjectId, ref: "Company" },
      affiliatedCompanies: [{ type: Schema.Types.ObjectId, ref: "Company" }],
      savedSearches: [{ type: Schema.Types.ObjectId }],
      settings: { type: Schema.Types.Mixed },
    },
    referent: {
      profile: { type: Schema.Types.Mixed },
      settings: { type: Schema.Types.Mixed },
    },
  },
  {
    timestamps: true, // Ceci ajoutera automatiquement createdAt et updatedAt
  }
);

userSchema.index({ "student.profile.address.location": "2dsphere" });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
