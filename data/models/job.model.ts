import { KvObject } from "@olli/kvdex";

export enum Company {
  AIRWALLEX = "Airwallex",
  GRAB = "Grab",
  TELUS = "Telus",
  VASS = "Vass",
  THOUGHTWORKS = "Thoughtworks",
}

export default interface Job extends KvObject {
  title: string;
  url: string;
  date: Date;
  description: string;
  company: Company;
}
