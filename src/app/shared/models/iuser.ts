export interface IUser {
  uid: string;
  name: string;
  email: string;
}

export interface INewUser {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}
