import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isUserLoggedIn.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          // Show an error message
          this.toastr.error('Önce giriş yapmalısınız.', 'Erişim Engellendi');
          // Redirect to the login page
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      })
    );
  }
}
