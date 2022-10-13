import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../authentification/auth.service";

/** 
 * Class for verfy if the user is connected to LDAP (Guard)
 */

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router) {}

    /** Verify if the user is authenticated */
    canActivate(route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot
                ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        if(this.authService.isAuth) {
            return true;
        } else {
            this.router.navigate(["/auth"]);
            return false;
        }
    }

}