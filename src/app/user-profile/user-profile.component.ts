import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  initialInput: any = {};
  favorites: any = [];

  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
  };
  constructor(
    public fetchApiData: FetchApiDataService,
    // public dialogRef: MatDialogRef<UserProfileComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }
  // Fetch user data via API
  getUserInfo(): void {
    this.user = this.fetchApiData.getOneUser();
    this.userData.Username = this.user.Username;
    this.userData.Email = this.user.Email;
    // this.user.Birthday comes in as ISOString format, like so: "2011-10-05T14:48:00.000Z"

    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.favorites = resp.filter(
        (m: { _id: any }) => this.user.FavMovies.indexOf(m._id) >= 0
      );
    });
  }

  // Update user data, such as username, password, email, or birthday
  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (result) => {
        localStorage.setItem('user', JSON.stringify(result));

        this.snackBar.open('User successfully updated', 'OK', {
          duration: 2000,
        });
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  // Delete user data for the user that is logged in
  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(
      (result) => {
        localStorage.clear();
        this.router.navigate(['welcome']);
        this.snackBar.open('User successfully deleted', 'OK', {
          duration: 2000,
        });
      },
      (result) => {
        this.snackBar.open('User successfully deleted', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
