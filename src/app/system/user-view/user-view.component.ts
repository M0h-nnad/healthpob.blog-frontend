import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { validator } from '../post-view/mime-validation';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit, OnDestroy {
  user: User;
  isLoading: boolean = false;
  UserFrom: FormGroup;
  passwordChangeForm: FormGroup;
  isPassword: boolean = false;
  userId: string;
  imageUrl: string;
  userReq;
  updateSubs: Subscription;
  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.addUserInformation();
  }

  initForm() {
    this.UserFrom = new FormGroup({
      email: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      yearsOfExperience: new FormControl(''),
      specialty: new FormControl(''),
      image: new FormControl(),
      bio: new FormControl(''),
      facebookLink: new FormControl(''),
      instagramLink: new FormControl(''),
      twitterLink: new FormControl(''),
      websiteLink: new FormControl(''),
    });
  }
  addUserInformation() {
    this.user = this.authService.getUserDoc();
    this.userId = this.user._id.toString();
    this.UserFrom.patchValue({
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      yearsOfExperience: this.user.yearsOfExperience,
      specialty: this.user.specialty,
      bio: this.user?.bio,
      facebookLink: this.user.facebookLink ? this.user.facebookLink : '',
      instagramLink: this.user.instagramLink ? this.user.instagramLink : '',
      twitterLink: this.user.twitterLink ? this.user.twitterLink : '',
      websiteLink: this.user.websiteLink ? this.user.websiteLink : '',
    });
    this.imageUrl = this.user.imagePath;
    this.isLoading = false;
  }

  onImagePic(event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.UserFrom.patchValue({ image: file });
    this.UserFrom.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSave() {
    let UserFormDate = new FormData();
    this.userReq = {
      email: this.UserFrom.controls['email'].value,
      firstName: this.UserFrom.controls['firstName'].value,
      lastName: this.UserFrom.controls['lastName'].value,
      yearsOfExperience: this.UserFrom.controls['yearsOfExperience'].value,
      specialty: this.UserFrom.controls['specialty'].value,
      photo: this.UserFrom.controls['image'].value,
      bio: this.UserFrom.controls['bio'].value,
      facebookLink: this.UserFrom.controls['facebookLink'].value,
      instagramLink: this.UserFrom.controls['instagramLink'].value,
      twitterLink: this.UserFrom.controls['twitterLink'].value,
      websiteLink: this.UserFrom.controls['websiteLink'].value,
    };
    for (let key in this.userReq) {
      UserFormDate.append(key, this.userReq[key]);
    }
    this.updateSubs = this.authService
      .updateUser(this.userId, UserFormDate)
      .subscribe(
        (res: any) => {
          this._snackbar.open(JSON.stringify(res.message), null, {
            duration: 5000,
          });
          this.cookieService.delete('userDoc');
          this.cookieService.set('userDoc', JSON.stringify(res.userDoc));
          this.router.navigate(['/system/posts']);
        },
        (error) => {
          this._snackbar.open(error.error.message, null, {
            duration: 5000,
          });
        }
      );
  }

  changePassMode() {
    this.isPassword = true;
    this.passwordChangeForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      { validator: this.mustMatch('newPassword', 'confirmNewPassword') }
    );
  }

  get f() {
    return this.passwordChangeForm.controls;
  }

  changePassword() {
    const passObject = {
      id: JSON.parse(this.cookieService.get('userDoc'))._id,
      newPassword: this.f.newPassword.value,
      oldPassword: this.f.oldPassword.value,
    };
    this.authService.updatePassword(passObject).subscribe(
      (res: { message }) => {
        this._snackbar.open(res.message, null, {
          duration: 5000,
        });
        this.router.navigate(['/system/posts']);
      },
      (err) => {
        this._snackbar.open(err.error.message, null, {
          duration: 5000,
        });
      }
    );
  }

  mustMatch(controlName: string, ComparedOne: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[ComparedOne];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnDestroy() {
    if (typeof this.updateSubs !== 'undefined') {
      this.updateSubs.unsubscribe();
    }
  }
}
