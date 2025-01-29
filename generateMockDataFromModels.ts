import { faker } from "@faker-js/faker/locale/fr";
import fs from "fs";
import { Types } from 'mongoose';
import path from "path";

// Configuration des nombres
const CONFIG = {
  COMPANIES: 30,
  COMPANY_EMPLOYEES: 100,
  OFFERS: 500,
  STUDENTS: 250,
};

// Types depuis les modèles
type BusinessSector =
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
  | "rechercheDeveloppement";

type UserRole = "admittedStudent" | "enrolledStudent" | "companyEmployee" | "referent" | "admin";
type RecruitmentProcess = "viaCompanySite" | "viaEmail" | "viaPlatform";
type CompanyStatus = "active" | "inactive" | "pending";

// Types simplifiés pour la génération de données
interface MockCompany {
  _id: Types.ObjectId;
  name: string;
  description: string;
  logo?: string;
  industry: BusinessSector;
  numberOfEmployees: number;
  status: CompanyStatus;
  siret: string;
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  employees: Types.ObjectId[];
  offers: Types.ObjectId[];
  socialMedia?: {
    linkedIn?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  recruitmentProcess?: RecruitmentProcess;
}

interface MockUser {
  _id: Types.ObjectId;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  student?: {
    profile: {
      address: {
        postalCode: string;
        city: string;
        location: {
          type: "Point";
          coordinates: [number, number];
        };
      };
      businessSector: BusinessSector[];
    };
    savedSearches: Types.ObjectId[];
    savedOffers: Types.ObjectId[];
    appliedOffers: Types.ObjectId[];
    settings: {
      notifications: {
        email: boolean;
        push: boolean;
      };
    };
  };
  companyEmployee?: {
    profile: {
      position: string;
    };
    companyId: Types.ObjectId;
    affiliatedCompanies: Types.ObjectId[];
    savedSearches: Types.ObjectId[];
    settings: {
      notifications: {
        email: boolean;
        push: boolean;
      };
    };
  };
}

interface MockOffer {
  _id: Types.ObjectId;
  status: "active" | "inactive";
  companyId: Types.ObjectId;
  appliedStudents: Types.ObjectId[];
  specialty: string;
  jobTitle: string;
  jobDescription: string;
  companyIndustry: BusinessSector;
  contractType: string;
  businessSector: BusinessSector[];
  address: {
    postalCode: string;
    city: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  contactCompany: boolean;
  startDate: Date;
  endDate: Date;
  alternanceTempo: string;
  expectedDuration: string;
  flexibleStartDate: boolean;
  educationLevel: string;
  remoteWork: boolean;
  remoteWorkFrequency: string;
  requiredLanguages: string[];
  skills: {
    soft: string[];
    hard: string[];
  };
  applicationInstructions: {
    channelType: RecruitmentProcess;
    companySiteUrl?: string;
    contactEmail?: string;
  };
  openToRqthProfiles: boolean;
}

// Constantes communes
const BUSINESS_SECTORS: BusinessSector[] = [
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
];

const IDF_CITIES = [
  {
    city: "Paris",
    postalCode: "75000",
    coordinates: [2.3522, 48.8566] as [number, number],
  },
  {
    city: "Versailles",
    postalCode: "78000",
    coordinates: [2.1326, 48.8044] as [number, number],
  },
  {
    city: "Saint-Germain-en-Laye",
    postalCode: "78100",
    coordinates: [2.087, 48.8989] as [number, number],
  },
  {
    city: "Rambouillet",
    postalCode: "78120",
    coordinates: [1.8332, 48.6425] as [number, number],
  },
  {
    city: "Mantes-la-Jolie",
    postalCode: "78200",
    coordinates: [1.7145, 48.9893] as [number, number],
  },
  {
    city: "Poissy",
    postalCode: "78300",
    coordinates: [2.042, 48.9295] as [number, number],
  },
  {
    city: "Plaisir",
    postalCode: "78370",
    coordinates: [1.9547, 48.8172] as [number, number],
  },
  {
    city: "Évry",
    postalCode: "91000",
    coordinates: [2.4539, 48.6294] as [number, number],
  },
  {
    city: "Nanterre",
    postalCode: "92000",
    coordinates: [2.2159, 48.8924] as [number, number],
  },
  {
    city: "Bobigny",
    postalCode: "93000",
    coordinates: [2.4398, 48.9147] as [number, number],
  },
  {
    city: "Créteil",
    postalCode: "94000",
    coordinates: [2.4594, 48.7898] as [number, number],
  },
  {
    city: "Cergy",
    postalCode: "95000",
    coordinates: [2.0741, 49.0359] as [number, number],
  },
  {
    city: "Melun",
    postalCode: "77000",
    coordinates: [2.6554, 48.5419] as [number, number],
  },
  {
    city: "Boulogne-Billancourt",
    postalCode: "92100",
    coordinates: [2.24, 48.8333] as [number, number],
  },
  {
    city: "Saint-Denis",
    postalCode: "93200",
    coordinates: [2.3586, 48.9367] as [number, number],
  },
];

const EDUCATION_LEVELS = ["bac+2", "bac+3", "bac+4", "bac+5"];
const CONTRACT_TYPES = ["Alternance", "Stage"];
const ALTERNANCE_TEMPO = ["3 semaines/1 semaine", "2 semaines/2 semaines", "1 mois/1 mois"];
const LANGUAGES = ["Français", "Anglais", "Espagnol", "Allemand"];
const SOFT_SKILLS = ["Communication", "Travail d'équipe", "Autonomie", "Leadership", "Adaptabilité"];
const HARD_SKILLS = ["JavaScript", "Python", "Java", "SQL", "React", "Node.js", "TypeScript", "MongoDB"];

// Générateurs de données
const generateLocation = () => {
  const randomCity = faker.helpers.arrayElement(IDF_CITIES);
  return {
    city: randomCity.city,
    postalCode: randomCity.postalCode,
    location: {
      type: "Point" as const,
      coordinates: randomCity.coordinates,
    },
  };
};

const usedIds = new Set<string>();

const generateUniqueObjectId = (): Types.ObjectId => {
  let id = new Types.ObjectId();
  while (usedIds.has(id.toString())) {
    id = new Types.ObjectId();
  }
  usedIds.add(id.toString());
  return id;
};

const generateCompany = (id: Types.ObjectId): MockCompany => ({
  _id: id,
  name: faker.company.name(),
  description: faker.company.catchPhrase(),
  logo: faker.image.urlLoremFlickr({ category: "business" }),
  industry: faker.helpers.arrayElement(BUSINESS_SECTORS),
  numberOfEmployees: faker.number.int({ min: 10, max: 1000 }),
  status: faker.helpers.arrayElement(["active", "inactive", "pending"] as CompanyStatus[]),
  siret: faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString(),
  contact: {
    email: faker.internet.email(),
    phone: faker.phone.number(),
    website: faker.internet.url(),
  },
  address: {
    street: faker.location.streetAddress(),
    ...generateLocation(),
    country: "France",
  },
  employees: [],
  offers: [],
  socialMedia: {
    linkedIn: faker.internet.url(),
    twitter: faker.internet.url(),
    facebook: faker.internet.url(),
    instagram: faker.internet.url(),
  },
  recruitmentProcess: faker.helpers.arrayElement(["viaCompanySite", "viaEmail", "viaPlatform"] as RecruitmentProcess[]),
});

const generateUser = (id: Types.ObjectId, role: UserRole, companyIds: Types.ObjectId[]): MockUser => {
  const baseUser = {
    _id: id,
    username: faker.internet.username(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    role,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };

  if (role === "admittedStudent" || role === "enrolledStudent") {
    return {
      ...baseUser,
      student: {
        profile: {
          address: generateLocation(),
          businessSector: faker.helpers.arrayElements(BUSINESS_SECTORS, { min: 1, max: 3 }),
        },
        savedSearches: [],
        savedOffers: [],
        appliedOffers: [],
        settings: {
          notifications: {
            email: faker.datatype.boolean(),
            push: faker.datatype.boolean(),
          },
        },
      },
    };
  }

  if (role === "companyEmployee") {
    return {
      ...baseUser,
      companyEmployee: {
        profile: {
          position: faker.person.jobTitle(),
        },
        companyId: faker.helpers.arrayElement(companyIds),
        affiliatedCompanies: faker.helpers.arrayElements(companyIds, { min: 1, max: 3 }),
        savedSearches: [],
        settings: {
          notifications: {
            email: faker.datatype.boolean(),
            push: faker.datatype.boolean(),
          },
        },
      },
    };
  }

  return baseUser;
};

const generateOffer = (id: Types.ObjectId, companyIds: Types.ObjectId[]): MockOffer => ({
  _id: id,
  status: faker.helpers.arrayElement(["active", "inactive"]),
  companyId: faker.helpers.arrayElement(companyIds),
  appliedStudents: [],
  specialty: faker.person.jobArea(),
  jobTitle: faker.person.jobTitle(),
  jobDescription: faker.lorem.paragraphs(3),
  companyIndustry: faker.helpers.arrayElement(BUSINESS_SECTORS),
  contractType: faker.helpers.arrayElement(CONTRACT_TYPES),
  businessSector: faker.helpers.arrayElements(BUSINESS_SECTORS, { min: 1, max: 3 }),
  address: generateLocation(),
  contactCompany: faker.datatype.boolean(),
  startDate: faker.date.future(),
  endDate: faker.date.future(),
  alternanceTempo: faker.helpers.arrayElement(ALTERNANCE_TEMPO),
  expectedDuration: `${faker.number.int({ min: 6, max: 36 })} mois`,
  flexibleStartDate: faker.datatype.boolean(),
  educationLevel: faker.helpers.arrayElement(EDUCATION_LEVELS),
  remoteWork: faker.datatype.boolean(),
  remoteWorkFrequency: faker.helpers.arrayElement(["none", "partial", "full"]),
  requiredLanguages: faker.helpers.arrayElements(LANGUAGES, { min: 1, max: 3 }),
  skills: {
    soft: faker.helpers.arrayElements(SOFT_SKILLS, { min: 2, max: 3 }),
    hard: faker.helpers.arrayElements(HARD_SKILLS, { min: 2, max: 4 }),
  },
  applicationInstructions: {
    channelType: faker.helpers.arrayElement(["viaCompanySite", "viaEmail", "viaPlatform"] as RecruitmentProcess[]),
    companySiteUrl: faker.internet.url(),
    contactEmail: faker.internet.email(),
  },
  openToRqthProfiles: faker.datatype.boolean(),
});

// Génération des données avec liens
const generateAllData = () => {
  const companies: MockCompany[] = [];
  const users: MockUser[] = [];
  const offers: MockOffer[] = [];

  // Générer les companies
  for (let i = 0; i < CONFIG.COMPANIES; i++) {
    companies.push(generateCompany(generateUniqueObjectId()));
  }

  const companyIds = companies.map((c) => c._id);

  // Générer les users
  // Employés
  for (let i = 0; i < CONFIG.COMPANY_EMPLOYEES; i++) {
    users.push(generateUser(generateUniqueObjectId(), "companyEmployee", companyIds));
  }
  // Étudiants
  for (let i = 0; i < CONFIG.STUDENTS; i++) {
    users.push(
      generateUser(
        generateUniqueObjectId(),
        faker.helpers.arrayElement(["admittedStudent", "enrolledStudent"] as UserRole[]),
        [],
      ),
    );
  }

  // Générer les offres
  for (let i = 0; i < CONFIG.OFFERS; i++) {
    offers.push(generateOffer(generateUniqueObjectId(), companyIds));
  }

  // Création des liens
  // Ajout des candidatures pour les étudiants
  users.forEach((user) => {
    if (user.role === "admittedStudent" || user.role === "enrolledStudent") {
      const numberOfApplications = faker.number.int({ min: 0, max: 5 });
      const numberOfSavedOffers = faker.number.int({ min: 0, max: 10 });

      const appliedOffers = faker.helpers.arrayElements(offers, numberOfApplications).map((o) => o._id);
      const savedOffers = faker.helpers.arrayElements(offers, numberOfSavedOffers).map((o) => o._id);

      user.student!.appliedOffers = appliedOffers;
      user.student!.savedOffers = savedOffers;

      // Mise à jour des offres correspondantes
      appliedOffers.forEach((offerId) => {
        const offer = offers.find((o) => o._id.equals(offerId));
        if (offer) {
          offer.appliedStudents.push(user._id);
        }
      });
    }
  });

  // Mise à jour des liens entreprises
  companies.forEach((company) => {
    // Trouver les employés
    company.employees = users
      .filter((user) => user.role === "companyEmployee" && user.companyEmployee?.companyId.equals(company._id))
      .map((user) => user._id);

    // Trouver les offres
    company.offers = offers.filter((offer) => offer.companyId.equals(company._id)).map((offer) => offer._id);
  });

  return { companies, users, offers };
};

const convertForMongoDB = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => convertForMongoDB(item));
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const converted: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Types.ObjectId) {
      converted[key] = { $oid: value.toString() };
    } else if (value instanceof Date) {
      converted[key] = { $date: value.toISOString() };
    } else if (Array.isArray(value)) {
      converted[key] = value.map(item => 
        item instanceof Types.ObjectId 
          ? { $oid: item.toString() }
          : convertForMongoDB(item)
      );
    } else if (value && typeof value === 'object') {
      converted[key] = convertForMongoDB(value);
    } else {
      converted[key] = value;
    }
  }
  
  return converted;
};

// Génération et sauvegarde des fichiers
const saveToJson = () => {
  const data = generateAllData();
  const outputPath = path.join(process.cwd(), "mock-data/collections");

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Conversion et sauvegarde des données
  fs.writeFileSync(
    path.join(outputPath, "jobbox_test.companies.json"), 
    JSON.stringify(data.companies.map(company => convertForMongoDB(company)), null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputPath, "jobbox_test.users.json"), 
    JSON.stringify(data.users.map(user => convertForMongoDB(user)), null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputPath, "jobbox_test.offers.json"), 
    JSON.stringify(data.offers.map(offer => convertForMongoDB(offer)), null, 2)
  );

  // Génération des statistiques
  const statistics = {
    companies: {
      total: data.companies.length,
      withEmployees: data.companies.filter((c) => c.employees.length > 0).length,
      withOffers: data.companies.filter((c) => c.offers.length > 0).length,
      averageEmployees: data.companies.reduce((acc, c) => acc + c.employees.length, 0) / data.companies.length,
      averageOffers: data.companies.reduce((acc, c) => acc + c.offers.length, 0) / data.companies.length,
    },
    users: {
      total: data.users.length,
      companyEmployees: data.users.filter((u) => u.role === "companyEmployee").length,
      admittedStudents: data.users.filter((u) => u.role === "admittedStudent").length,
      enrolledStudents: data.users.filter((u) => u.role === "enrolledStudent").length,
      averageApplications:
        data.users
          .filter((u) => u.role === "admittedStudent" || u.role === "enrolledStudent")
          .reduce((acc, u) => acc + (u.student?.appliedOffers?.length || 0), 0) /
        data.users.filter((u) => u.role === "admittedStudent" || u.role === "enrolledStudent").length,
    },
    offers: {
      total: data.offers.length,
      withApplicants: data.offers.filter((o) => o.appliedStudents.length > 0).length,
      averageApplicants: data.offers.reduce((acc, o) => acc + o.appliedStudents.length, 0) / data.offers.length,
    },
  };

  fs.writeFileSync(path.join(outputPath, "statistics.json"), JSON.stringify(statistics, null, 2));

  console.log("Données générées avec succès !");
  console.log("\nStatistiques :");
  console.log(JSON.stringify(statistics, null, 2));
};

saveToJson();
