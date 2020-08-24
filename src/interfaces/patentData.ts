import { IPerson } from "./person";
import ISentiment from "./sentiment";
import { safePatent } from "./usPatentRespose";

export interface DocData {
    patent:    safePatent;
    person:    IPerson;
    sentiment: ISentiment;
}