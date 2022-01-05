import {User} from "@definitions/User";

export type Message = {
    user: User;
    text: string;
    createdAt: Date | string;
}