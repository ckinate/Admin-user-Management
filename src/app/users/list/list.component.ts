import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { AlertService } from 'src/app/_services/alert.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  users: any;

  constructor(   private userService: UserService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);

            console.log(`The users on list Page Reload is ${this.users}`)
  }

  deleteUser(id: string) {
    const user = this.users.find((x :any) => x.id === id);
    user.isDeleting = true;
    this.userService.delete(id)
        .pipe(first())
        .subscribe(() => this.users = this.users.filter((x :any) => x.id !== id));
}

}
