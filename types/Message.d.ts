import {User, UserMinimum} from "@definitions/User";
import {Resource} from "@definitions/Resource/Resource";

export type Message = {
    user: UserMinimum;
    text: string;
    attachment: Resource | null;
    channel: string;
}