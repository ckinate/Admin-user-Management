import { Role } from "./role";

export class User {
    id!: number;
    firstName: string | undefined;
    lastName: string | undefined;
    username: string | undefined;
    createdBy!: string;
    role!: Role;
    token?: string;
}
