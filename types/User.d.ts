export type User = {
  fullName: string;
  birthDate: Date | string;
  email: string;
  password?: string | undefined;
  role: "user" | "moderator" | "admin" | "superadmin";
  createdAt: Date;
  photoURL: string;
  uid: string;
  validated: boolean;
};

export type UserMinimum = {
  fullName: string;
  photoURL: string;
  uid: string;
};
