import {createAction, props} from '@ngrx/store';
import {User, UserRegister} from './auth.models';

// Register action
export const Register = createAction(
    '[Authentication] Register',
    props<{
        user: UserRegister
    }>());
export const RegisterSuccess = createAction(
    '[Authentication] Register Success',
    props<{ isLoggedIn: boolean }>()
);
export const RegisterFailure = createAction(
    '[Authentication] Register Failure',
    props<{ error: string }>()
);

// login action
export const login = createAction(
    '[Authentication] Login',
    props<{ email: string, password: string }>()
);
export const loginSuccess = createAction(
    '[Authentication] Login Success',
    props<{ user: User }>()
);
export const loginFailure = createAction(
    '[Authentication] Login Failure',
    props<{ error: any }>()
);


// logout action
export const logout = createAction(
    '[Authentication] Logout'
);

export const logoutSuccess = createAction(
    '[Auth] Logout Success'
);

