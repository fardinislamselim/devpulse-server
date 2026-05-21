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

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IJwtPayload {
  id: number;
  name: string;
  role: IUserRole;
  iat?: number;
  exp?: number;
}

// ── Issue 

export type IIssueType = "bug" | "feature_request";
export type IIssueStatus = "open" | "in_progress" | "resolved";

export interface ICreateIssueBody {
  title: string;
  description: string;
  type: IIssueType;
}

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: IIssueType;
  status: IIssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}