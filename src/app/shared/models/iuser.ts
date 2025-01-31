export interface IUser {
  email: string;
}

export interface INewUser extends IUser {
  name: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}
