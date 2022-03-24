import { UserMinimum } from "types/User";

export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return "L'adresse email est requise.";
  if (!re.test(email)) return "Oups! Nous n'acceptons que les emails valides.";
  return "";
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0)
    return "Le mot de passe ne peut pas être vide.";
  return "";
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return "Le nom ne peut pas être vide.";
  return "";
};

export const membersValidator = (members: UserMinimum[]) => {
  if (members.length === 0) return "Vous devez ajouter au moins un membre.";
  return "";
};

export const messageValidator = (message: string) => {
  if (!message || message.trim().length <= 0) return "Le message ne peut pas être vide.";
  return "";
};
