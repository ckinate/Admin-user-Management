import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_model';
import { AuthenticationService, UserService } from '../_services';


@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {
    loading = false;
    users: User[] = [];
    userFromApi!: User;
    UserList: User[] = [];
    user: any;

    constructor(private userService: UserService, private authenticationService: AuthenticationService) {
      this.user = this.authenticationService.userValue ;
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });

        let Id = this.user?.id;
        this.userService.getById(Id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });

        this.getUserCreatedByLoginAdmin();
    }

    getUserCreatedByLoginAdmin(){
      this.userService.getAll().pipe(first()).subscribe(res=>{
         this.UserList = res.filter((x :any) => x.createdBy == this.user?.username);
         console.log(`The List created by Admin is ${JSON.stringify(res)}`);
      })
      }
}
