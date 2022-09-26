import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
    constructor(private router: Router,private http: HttpClient) {
      this.userSubject = new BehaviorSubject<User |null>(JSON.parse(localStorage.getItem('user')|| '{}'));
        this.user = this.userSubject.asObservable();
     }

     public get userValue(): User| null {
      return this.userSubject.value;
  }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id?: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    register(user: User) {
      return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    update(id: any, params: any) {
      return this.http.put(`${environment.apiUrl}/users/${id}`, params)
          .pipe(map(x => {
              // update stored user if the logged in user updated their own record
              if (id == this.userValue?.id) {
                  // update local storage
                  const user = { ...this.userValue, ...params };
                  localStorage.setItem('user', JSON.stringify(user));

                  // publish updated user to subscribers
                  this.userSubject.next(user);
              }
              return x;
          }));
    }

    logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('user');
      this.userSubject.next(null);
      this.router.navigate(['/login']);
    }
    delete(id: any) {
      return this.http.delete(`${environment.apiUrl}/users/${id}`)
          .pipe(map(x => {
              // auto logout if the logged in user deleted their own record
              if (id == this.userValue?.id) {
                  this.logout();
              }
              return x;
          }));
    }
}
