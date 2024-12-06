import { Component, OnInit } from '@angular/core';
import { jwtDecode } from "jwt-decode";



import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../services/userResponse.model';


@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Başlangıçta kullanıcı giriş yapmamış olarak kabul edelim
  userPhoto: { [key: number]: string } = {};
  userId!: number | undefined;
  searchTerm: string = '';
  searchResults: any[] = [];
  isAdmin: boolean | undefined;
  
  constructor(private userService: UserService, private http: HttpClient, private dialog: MatDialog, private router: Router) {
   
  }

  ngOnInit() {
    this.userId = this.getUserIdFromToken();
    this.userService.isTokenInStorage().subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;

    });
     this.userService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin);

   /*this.getUserPhoto(this.userId).subscribe((photo) => {
      this.userPhoto = photo
      console.log(7, this.userPhoto)
    });*/ 

  }


  getUserProfileLink(): string {
    if (this.userId !== undefined) {
      return '/blog/profile/' + this.userId;
    }
    // If the user ID is undefined, redirect to the home page.
    return '/blog';
  }

  private getUserIdFromToken(): number | undefined {
    const token = localStorage.getItem('token');
    if (!token) {
      return undefined;
    }

    // Decode the token
    const decodedToken: UserResponse = jwtDecode(token);

    // Return the user ID directly from the decoded token
    if (decodedToken.id) {
      this.userId = decodedToken.id;
      return decodedToken.id;
    }

    return undefined;
  }



  search(): void {
    if (this.searchTerm.trim() === '') {
      this.searchResults = [];
      console.log(this.searchTerm);
      return;
    }



    this.router.navigate(['/blog', 'search', this.searchTerm]); // Sadece yönlendirme yapılıyor
  }






  login() {
    // Giriş yap butonuna tıklandığında oturum açma işlemlerini yapabilirsiniz
    // Örnek olarak AuthService'de bir login() metodu olduğunu varsayalım

  }

  logout() {
    // Çıkış yap butonuna tıklandığında oturum kapatma işlemlerini yapabilirsiniz
    // Örnek olarak AuthService'de bir logout() metodu olduğunu varsayalım
    this.userService.logout();
    location.reload();
  }
}
