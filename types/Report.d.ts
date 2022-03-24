import { UserMinimum } from "@definitions/User";
import { ResourceMinimum } from "@definitions/Resource";

export type Report = {
    emitter: UserMinimum;
    document: UserMinimum | ResourceMinimum;
    type: "user" | "document";
    validated: boolean;
    context: String;
    createdAt: Date;
    uid: string;
};
