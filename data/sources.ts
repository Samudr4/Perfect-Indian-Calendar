import { SourceCitation } from "./types";

export const SOURCES: Record<string, SourceCitation> = {
  "src-assam-gazette": {
    id: "src-assam-gazette",
    title: "The Assam Gazette & State Archives",
    publisher: "Government of Assam",
    url: "https://assam.gov.in",
    note: "Official gazette records and state anniversary notifications.",
  },
  "src-sahitya-akademi": {
    id: "src-sahitya-akademi",
    title: "Sahitya Akademi Biographical Database",
    publisher: "Sahitya Akademi, National Academy of Letters",
    url: "https://sahitya-akademi.gov.in",
    note: "Official archives for Indian literary figures and regional language laureates.",
  },
  "src-national-portal": {
    id: "src-national-portal",
    title: "National Portal of India — Know India Archive",
    publisher: "Ministry of Electronics & Information Technology, Government of India",
    url: "https://knowindia.india.gov.in",
  },
  "src-asi": {
    id: "src-asi",
    title: "Archaeological Survey of India Records",
    publisher: "Ministry of Culture, Government of India",
    url: "https://asi.nic.in",
  },
  "src-nobel-prize": {
    id: "src-nobel-prize",
    title: "Nobel Prize Official Biographical Archive",
    publisher: "The Nobel Foundation",
    url: "https://www.nobelprize.org",
  },
  "src-sangeet-natak": {
    id: "src-sangeet-natak",
    title: "Sangeet Natak Akademi Fellowships & Awards Archive",
    publisher: "Sangeet Natak Akademi, New Delhi",
    url: "https://sangeetnatak.gov.in",
  },
  "src-gauhati-univ": {
    id: "src-gauhati-univ",
    title: "Historical Records & Manuscripts Repository",
    publisher: "Department of Historical and Antiquarian Studies, Gauhati University",
    note: "Chronicles of Ahom Buranjis and Assamese socio-cultural movements.",
  },
};

export function getSourceById(id: string): SourceCitation | undefined {
  return SOURCES[id];
}
