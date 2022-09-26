import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { Role, User } from '../_model';
import { AuthenticationService, UserService } from '../_services';



@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    user: User | null;
    userFromApi!: User;
    UserList: User[] = [];
  users: any;

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) {
        this.user = this.authenticationService.userValue;
    }

    ngOnInit() {
        this.loading = true;
        let Id = this.user?.id;
        this.userService.getById(Id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });


    }



  getUserCreatedByLoginAdmin(){
    this.userService.getAll().pipe(first()).subscribe(res=>{
       this.UserList = res.filter((x :any) => x.createdBy == this.user?.username);
       console.log(`The List created by Admin is ${JSON.stringify(res)}`);
    })
    }
}
