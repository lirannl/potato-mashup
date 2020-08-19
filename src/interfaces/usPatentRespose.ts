import { Url } from "url";

export interface usPatentDoc {
  applicationType: string;
  documentID: string;
  applicationNumber: string;
  documentType: string;
  patentNumber: string;
  publicationDate: Date;
  documentDate: Date;
  productionDate: Date;
  applicationDate: Date;
  applicant: string[];
  inventor: string[];
  assignee: string[];
  title: string;
  archiveURL: Url;
  pdfPath: string;
  year: number;
  version: number;
}

export interface usPatentRes {
  numFound: number;
  start: number;
  docs: usPatentDoc[];
}
