import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { jwtDecode } from "jwt-decode";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NewUser } from '../models/newUser.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../env/environment.prod';
import { Role } from '../enums/role.enum';
import { RegisterResponseDTO } from '../models/registerResponseDTO ';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user$ = new BehaviorSubject<User>(null!);
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  }

  get userId(): Observable<User> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user);
      })
    );
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (user && user.fullName) {
          return of(user.fullName);  // Use userName instead of firstName and lastName
        } else {
          return of(''); // Return empty if no userName
        }
      })
    );
  }

  getUserFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (user) {
          return of(user.fullName); // Use userName here as well
        }
        return of(''); // Return empty if no user
      })
    );
  }



  getCurrentUserObservable(): Observable<User | null> {
    return this.user$.asObservable();
  }



  get userStream(): Observable<User> {
    return this.user$.asObservable();
  }

  getUserImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`)
      .pipe(take(1));
  }



 

  uploadBlogImage(formData: FormData): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(`${environment.baseApiUrl}/blog/image`, formData)
  }

  get isAdmin(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap(() => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            // Decode the token based on the updated structure
            const decodedToken: any = jwtDecode(token);

            // Check the role in the decoded token
            const userRole = decodedToken?.role;
            console.log("USER ROLE:", userRole);

            // Return true if the role is Admin, otherwise false
            return of(userRole === 'Admin');
          }

          // Return false if no token is found
          return of(false);
        } catch (error) {
          console.error('Token decode error:', error);
          return of(false);
        }
      })
    );
  }


  isTokenInStorage(): Observable<boolean> {
    const token = localStorage.getItem('token');
    console.log(token,12431);
    if (!token) {
      return of(false);
    }

    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken, 912431);
      if (!decodedToken?.exp) {
        return of(false);
      }

      const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
      const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

      if (isExpired) {
        return of(false);
      }

      const user: User = {
          id: Number(decodedToken.id), 
          fullName: decodedToken.fullName,
          email: decodedToken.email,
          role: decodedToken.role,
          password: ''
      };
      console.log(user, 111312431);
      this.user$.next(user);

      return of(true);
    } catch (error) {

      return of(false);
    }
  }


  getUserProfile(userId: number): Observable<any> {
    const url = `${environment.baseApiUrl}/blog/profile/${userId}`;
    return this.http.get<any>(url);
  }

  getDefaultProfileImage(): string {
    return '../../../../assets/default-profile-image.jpg';
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${environment.baseApiUrl}/auth/login`, { email, password }, this.httpOptions)
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          localStorage.setItem('token', response.token);
          console.log(response.token);

          // Decode the JWT token
          const decodedToken: any = jwtDecode(response.token);  // We can cast it to `any` to avoid type issues
          console.log(decodedToken,999)

          // Log the decoded token
          console.log('Decoded Token:', JSON.stringify(decodedToken, null, 2));

          // Map the decoded token to the User interface
          const user: User = {
              id: Number(decodedToken.id), // Ensure id is a number
              fullName: decodedToken.fullName,
              email: decodedToken.email,
              role: decodedToken.role, // Ensure role is a string, could also be an enum if needed,
              password: ''
          };

          // Update the user behavior subject
          this.user$.next(user);
          console.log(user.fullName);

          // Navigate based on role
          if (user.role === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }

          // Show success toast
          this.toastr.success(`Hoş geldiniz, ${user.fullName}!`, 'Başarılı');
        }),
        catchError((error) => {
          this.toastr.error('Giriş işlemi sırasında bir hata oluştu.', 'Hata');
          return throwError(error);
        })
      );
  }



  register(newUser: { email: string; password: string; fullName: string }): Observable<RegisterResponseDTO> {
    const isAdmin = newUser.email.toLowerCase() === 'OgrenciNuramarasi@sakarya.edu.tr'.toLowerCase();

    // Eğer admin ise sabit şifre kullan
    const password = isAdmin ? 'sau' : newUser.password;

    // API'ye istek gönder
    return this.http
      .post<RegisterResponseDTO>(`${environment.baseApiUrl}/auth/register`, {
        email: newUser.email,
        password,
        fullName: newUser.fullName // FullName'i backend'e gönderiyoruz
      }, this.httpOptions)
      .pipe(
        switchMap((response: RegisterResponseDTO) => {
          const loginPassword = isAdmin ? password : newUser.password;

          // Kayıt sonrası otomatik giriş
          return this.login(newUser.email, loginPassword).pipe(map(() => response));
        }),
        tap(() => this.toastr.success('Kayıt işlemi başarılı.', 'Başarılı')),
        catchError((error) => {
          this.toastr.error('Kayıt işlemi sırasında bir hata oluştu.', 'Hata');
          return throwError(error);
        })
      );
  }



  logout(): void {
    this.user$.next(null!);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }
}
