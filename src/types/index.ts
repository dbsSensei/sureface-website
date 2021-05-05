export type BookingType = {
  _id: string;
  event: EventType;
  user: UserType;
  createdAt: Date;
  updatedAt: Date;
};

export type EventType = {
  _id: string;
  title: string;
  description: string;
  price: number;
  date: Date;
  creator?: { _id: string };
};

export type UserType = {
  _id: string;
  email: string;
  password: string;
  createdEvents?: { _id: string };
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthType = {
  token: string;
  userId: string;
  tokenExpiration: number;
};

export type AuthContext = {
  token: string;
  userId: string;
  login: (params: AuthType) => void;
  logout?: any;
};

export interface AxiosResponse<T> {
  data: { data: { [key: string]: T }; errors: any };
}
