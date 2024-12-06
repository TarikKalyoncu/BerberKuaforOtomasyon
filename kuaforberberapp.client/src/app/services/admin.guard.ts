import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userService.getCurrentUserObservable().pipe(
      map(user => {
        // Rol kontrolü ile admin kontrolü
        if (user && user.role && user.role.includes('Admin')) {
          console.log(user.id);  // Admin kullanıcı bilgisi
          this.toastr.success('Admin sayfasına başarıyla erişildi!', 'Başarılı');
          return true;
        } else {
          this.toastr.error('Bu sayfaya erişim izniniz yok.', 'Hata');
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError((error) => {
        // Hata durumu için ekstra kontrol
        this.toastr.error('Bir hata oluştu.', 'Hata');
        this.router.navigate(['/']);
        return [false]; // Erişim engelleniyor
      })
    );
  }
}
