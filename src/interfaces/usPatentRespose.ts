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
  archiveURL: URL;
  pdfPath: string;
  year: number;
  version: number;
}

export interface usPatentParams {
  applicationType?: string;
  documentID?: string;
  applicationNumber?: string;
  documentType?: string;
  patentNumber?: number;
  publicationDate?: Date;
  documentDate?: Date;
  productionDate?: Date;
  applicationDate?: Date;
  applicant?: string | string[];
  inventor?: string | string[];
  assignee?: string | string[];
  start?: number;
  title?: string;
  archiveURL?: URL;
  pdfPath?: string;
  year?: number;
  version?: number;
}

export interface usPatentRes {
  numFound: number;
  start: number;
  docs: usPatentDoc[];
}

export interface safePatent {
  result: number;
  attemptsTaken: number;
}
