import { Schema, model, Document } from "mongoose";

interface City extends Document {
  inseeCode: string;
  postalCode: string;
  cityName: string;
  departmentCode: string;
  departmentName: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const citySchema = new Schema<City>(
  {
    inseeCode: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    cityName: {
      type: String,
      required: true,
    },
    departmentCode: {
      type: String,
    },
    departmentName: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Index géospatial pour les recherches de proximité
citySchema.index({ location: "2dsphere" });
// Index pour améliorer les recherches textuelles
citySchema.index({ cityName: 1 });
citySchema.index({ postalCode: 1 });
citySchema.index({ departmentName: 1 });

const CityModel = model<City>("City", citySchema);

export default CityModel;
