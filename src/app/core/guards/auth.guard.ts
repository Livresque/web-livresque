import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUser();
        console.log(currentUser);
        if (currentUser && currentUser.email != '' && currentUser.is_active==true) {
            return true;
        } else {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }

}
