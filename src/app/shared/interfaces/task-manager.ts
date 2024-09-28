import { Task } from "./models/task";

export interface TaskManager {
    isEdit: boolean;
    taskKey?: string;
}