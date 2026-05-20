export type IUserRole = "contributor" | "maintainer";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: IUserRole;
  created_at: Date;
  updated_at: Date;
}

export interface ISignupBody {
  name: string;
  email: string;
  password: string;
  role?: IUserRole;
}

export interface IPublicUser {
  id: number;
  name: string;
  email: string;
  role: IUserRole;
  created_at: Date;
  updated_at: Date;
}