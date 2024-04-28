import { Project } from "../types";

export const isManager = (managerId: Project['manager'], userId: Project['_id']) => {
    return managerId.toString() === userId.toString();
}