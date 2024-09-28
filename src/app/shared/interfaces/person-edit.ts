import { Person } from "./models/person";

export interface EditPersonData {
    index: number;
    person: Person;
}