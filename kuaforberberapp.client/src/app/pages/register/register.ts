import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { usernameValidator } from '../../services/regexValidator';
import { UserService } from '../../services/user.service';
import { passwordMatchValidatorService } from '../../services/passwordMatchValidatorService.service';
import { User } from '../../models/user.model';
import { Role } from '../../enums/role.enum';
import { RegisterResponseDTO } from '../../models/registerResponseDTO ';
import { NewUser } from '../../models/newUser.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false,
  styleUrls: ['./register.css'],
})
export class RegisterPageComponent implements OnInit {
  public signupForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  pwdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private match: passwordMatchValidatorService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {

        firstName: ["", usernameValidator],
        lastName: ["",],
        email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
        password: ['', [Validators.required, Validators.pattern(this.pwdPattern)]],
        confirmpassword: [''],
      },
      {
        validator: this.match.passwordMatchValidator('password', 'confirmpassword'),
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register() {

    const { firstName, lastName, email, password } = this.signupForm.value;
    console.log(this.signupForm.value);
    const fullName = firstName + lastName;
    const newUser: User = {
      fullName, email, password,
      id: 0
    };

    return this.userService.register(newUser).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
