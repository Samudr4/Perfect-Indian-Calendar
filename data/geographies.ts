export type GeographyType = "state" | "union-territory" | "all-india";

export interface Geography {
  id: string;
  type: GeographyType;
  name: string;
  nativeName?: string;
  code: string;
  capital?: string;
  locale?: string;
  description?: string;
}

export const INDIAN_GEOGRAPHIES: Geography[] = [
  // Default: Assam
  {
    id: "assam",
    type: "state",
    name: "Assam",
    nativeName: "অসম",
    code: "AS",
    capital: "Dispur",
    locale: "as-IN",
    description: "State calendar of Assam — regional history, literary icons, cultural observances, and state heritage.",
  },
  {
    id: "all-india",
    type: "all-india",
    name: "All India (National)",
    nativeName: "भारत",
    code: "IN",
    capital: "New Delhi",
    locale: "en-IN",
    description: "National calendar of India — national milestones, historical events, cultural heritage, and anniversaries.",
  },
  // States in Alphabetical Order
  {
    id: "andhra-pradesh",
    type: "state",
    name: "Andhra Pradesh",
    nativeName: "ఆంధ్రప్రదేశ్",
    code: "AP",
    capital: "Amaravati",
  },
  {
    id: "arunachal-pradesh",
    type: "state",
    name: "Arunachal Pradesh",
    nativeName: "अरुणाचल प्रदेश",
    code: "AR",
    capital: "Itanagar",
  },
  {
    id: "bihar",
    type: "state",
    name: "Bihar",
    nativeName: "बिहार",
    code: "BR",
    capital: "Patna",
  },
  {
    id: "chhattisgarh",
    type: "state",
    name: "Chhattisgarh",
    nativeName: "छत्तीसगढ़",
    code: "CG",
    capital: "Raipur",
  },
  {
    id: "goa",
    type: "state",
    name: "Goa",
    nativeName: "गोंय",
    code: "GA",
    capital: "Panaji",
  },
  {
    id: "gujarat",
    type: "state",
    name: "Gujarat",
    nativeName: "ગુજરાત",
    code: "GJ",
    capital: "Gandhinagar",
  },
  {
    id: "haryana",
    type: "state",
    name: "Haryana",
    nativeName: "हरियाणा",
    code: "HR",
    capital: "Chandigarh",
  },
  {
    id: "himachal-pradesh",
    type: "state",
    name: "Himachal Pradesh",
    nativeName: "हिमाचल प्रदेश",
    code: "HP",
    capital: "Shimla",
  },
  {
    id: "jharkhand",
    type: "state",
    name: "Jharkhand",
    nativeName: "झारखंड",
    code: "JH",
    capital: "Ranchi",
  },
  {
    id: "karnataka",
    type: "state",
    name: "Karnataka",
    nativeName: "ಕರ್ನಾಟಕ",
    code: "KA",
    capital: "Bengaluru",
  },
  {
    id: "kerala",
    type: "state",
    name: "Kerala",
    nativeName: "കേരളം",
    code: "KL",
    capital: "Thiruvananthapuram",
  },
  {
    id: "madhya-pradesh",
    type: "state",
    name: "Madhya Pradesh",
    nativeName: "मध्य प्रदेश",
    code: "MP",
    capital: "Bhopal",
  },
  {
    id: "maharashtra",
    type: "state",
    name: "Maharashtra",
    nativeName: "महाराष्ट्र",
    code: "MH",
    capital: "Mumbai",
  },
  {
    id: "manipur",
    type: "state",
    name: "Manipur",
    nativeName: "মণিপুর",
    code: "MN",
    capital: "Imphal",
  },
  {
    id: "meghalaya",
    type: "state",
    name: "Meghalaya",
    nativeName: "Meghalaya",
    code: "ML",
    capital: "Shillong",
  },
  {
    id: "mizoram",
    type: "state",
    name: "Mizoram",
    nativeName: "Mizoram",
    code: "MZ",
    capital: "Aizawl",
  },
  {
    id: "nagaland",
    type: "state",
    name: "Nagaland",
    nativeName: "Nagaland",
    code: "NL",
    capital: "Kohima",
  },
  {
    id: "odisha",
    type: "state",
    name: "Odisha",
    nativeName: "ଓଡ଼ିଶା",
    code: "OD",
    capital: "Bhubaneswar",
  },
  {
    id: "punjab",
    type: "state",
    name: "Punjab",
    nativeName: "ਪੰਜਾਬ",
    code: "PB",
    capital: "Chandigarh",
  },
  {
    id: "rajasthan",
    type: "state",
    name: "Rajasthan",
    nativeName: "राजस्थान",
    code: "RJ",
    capital: "Jaipur",
  },
  {
    id: "sikkim",
    type: "state",
    name: "Sikkim",
    nativeName: "सिक्किम",
    code: "SK",
    capital: "Gangtok",
  },
  {
    id: "tamil-nadu",
    type: "state",
    name: "Tamil Nadu",
    nativeName: "தமிழ்நாடு",
    code: "TN",
    capital: "Chennai",
  },
  {
    id: "telangana",
    type: "state",
    name: "Telangana",
    nativeName: "తెలంగాణ",
    code: "TS",
    capital: "Hyderabad",
  },
  {
    id: "tripura",
    type: "state",
    name: "Tripura",
    nativeName: "ত্রিপুরা",
    code: "TR",
    capital: "Agartala",
  },
  {
    id: "uttar-pradesh",
    type: "state",
    name: "Uttar Pradesh",
    nativeName: "उत्तर प्रदेश",
    code: "UP",
    capital: "Lucknow",
  },
  {
    id: "uttarakhand",
    type: "state",
    name: "Uttarakhand",
    nativeName: "उत्तराखंड",
    code: "UK",
    capital: "Dehradun",
  },
  {
    id: "west-bengal",
    type: "state",
    name: "West Bengal",
    nativeName: "পশ্চিমবঙ্গ",
    code: "WB",
    capital: "Kolkata",
  },
  // Union Territories
  {
    id: "andaman-and-nicobar",
    type: "union-territory",
    name: "Andaman and Nicobar Islands",
    nativeName: "अंडमान और निकोबार",
    code: "AN",
    capital: "Port Blair",
  },
  {
    id: "chandigarh",
    type: "union-territory",
    name: "Chandigarh",
    nativeName: "चंडीगढ़",
    code: "CH",
    capital: "Chandigarh",
  },
  {
    id: "dadra-nagar-haveli-daman-diu",
    type: "union-territory",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    nativeName: "दादरा और नगर हवेली",
    code: "DH",
    capital: "Daman",
  },
  {
    id: "delhi",
    type: "union-territory",
    name: "Delhi (NCT)",
    nativeName: "दिल्ली",
    code: "DL",
    capital: "New Delhi",
  },
  {
    id: "jammu-and-kashmir",
    type: "union-territory",
    name: "Jammu and Kashmir",
    nativeName: "جموں و کشمیر",
    code: "JK",
    capital: "Srinagar / Jammu",
  },
  {
    id: "ladakh",
    type: "union-territory",
    name: "Ladakh",
    nativeName: "ལ་དྭགས",
    code: "LA",
    capital: "Leh",
  },
  {
    id: "lakshadweep",
    type: "union-territory",
    name: "Lakshadweep",
    nativeName: "ലക്ഷദ്വീപ്",
    code: "LD",
    capital: "Kavaratti",
  },
  {
    id: "puducherry",
    type: "union-territory",
    name: "Puducherry",
    nativeName: "புதுச்சேரி",
    code: "PY",
    capital: "Puducherry",
  },
];

export const DEFAULT_GEOGRAPHY_ID = "assam";

export function getIndianGeographies(): Geography[] {
  return INDIAN_GEOGRAPHIES;
}

export function getGeographyById(id: string): Geography {
  const found = INDIAN_GEOGRAPHIES.find((g) => g.id === id);
  return found || INDIAN_GEOGRAPHIES[0];
}
