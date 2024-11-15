export interface Address {
  firstname: string;
  lastname: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  phone: string;
}

export interface UserData {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  country: string;
  address: Address;
  user_id: number;
  role: string;
  password: string;
  profile: string | null;
  active: boolean;
  created_at: string;
  about: string | null;
  profile_picture:string
}

export interface User {
  status: boolean;
  message: string;
  data: UserData;
}
