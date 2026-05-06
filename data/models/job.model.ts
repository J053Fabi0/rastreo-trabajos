import { KvObject } from "@olli/kvdex";

export enum Company {
  AIRWALLEX = "Airwallex",
}

export default interface Job extends KvObject {
  title: string;
  url: string;
  date: Date;
  description: string;
  company: Company;
}
