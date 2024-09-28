import { Person } from "./person";

export interface Task {
    key: string;
    name: string;
    limitDate: Date;
    status: number;
    associatedPersons: Person[];
}