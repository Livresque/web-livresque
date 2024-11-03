// export class User {
  // id?: number;
  // username?: string;
  // password?: string;
  // firstName?: string;
  // lastName?: string;
  // token?: string;
  // email?: string;
// }


export class User {
  id:number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  adresse:string;
  about_us:string;
  profile_picture:string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: Date;
}

// export class UserRegister{
//   email: string;
//   username: string;
//   first_name: string;
//   last_name: string;
//   role: string;
//   password: string
//   profile_picture: string;
// }



export class UserRegister {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  role: string;
  profile?: File;
  about?: string;
  active?: true;
  address_1?: string;
  address_2?: string;
  city?: string;
  postcode?: string;
  state?: string;
  phone?: string;
  country: string
}
export class UserAddress {
  country: string;
}


export class AuthResponse {
  token: string;
  user: User;
}
