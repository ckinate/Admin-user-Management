import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '../_model';



let users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin , createdBy:"christian kinate" },
    { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User , createdBy:"christian kinate"}
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.endsWith('/users/register') && method === 'POST':
                     return register();
               case url.match(/\/users\/\d+$/) && method === 'PUT':
                      return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                   return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: `fake-jwt-token.${user.id}`
            });
        }

        function getUsers() {
            if (!isAdmin()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            if (!isAdmin() && currentUser()?.id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        function register() {
          const user = body

          if (users.find((x:any) => x.username === user.username)) {
              return error('Username "' + user.username + '" is already taken')
          }

          user.id = users.length ? Math.max(...users.map((x:any) => x.id)) + 1 : 1;
          users.push(user);
          localStorage.setItem("Users", JSON.stringify(users));
          console.log(`The users added is ${localStorage.getItem("Users")}`);

          return ok();
        }

        function updateUser() {
          if (!isLoggedIn()) return unauthorized();

          let params = body;
          let user = users.find((x:any) => x.id === idFromUrl());

          // only update password if entered
          if (!params.password) {
              delete params.password;
          }

          // update and save user
          Object.assign(user, params);
          localStorage.setItem("Users", JSON.stringify(users));
          console.log(`The users added is ${localStorage.getItem("Users")}`);

          return ok();
        }


        function deleteUser() {
          if (!isLoggedIn()) return unauthorized();

          users = users.filter((x:any) => x.id !== idFromUrl());
          localStorage.setItem("Users", JSON.stringify(users));
          console.log(`The users added is ${localStorage.getItem("Users")}`);
          return ok();
        }

        // helper functions

        function ok(body?:any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function error(message: any) {
            return throwError({ status: 400, error: { message } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function isAdmin() {
            return isLoggedIn() && currentUser()?.role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const HeadId =  headers.get('Authorization')?.split('.')[1]
            const id = parseInt(HeadId||"" );
         //   const id = parseInt(headers.get('Authorization').split('.')[1]);
            return users.find(x => x.id === id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
