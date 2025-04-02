
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { companyInfo, employee, LoginResponse, loginUser, newUser, User } from '../model/model';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

export interface refreshDoc {
  "token": string, "clientId": string, "refreshToken": string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient)
  private accessToken = signal<string>('')
  private refreshToken = signal<string>('')
  private userId = signal<string>('')
  private clientId = signal<string>('ERPWebApp')

  private userDataSignal = signal<User | null>(null);

  validToken = signal<boolean>(false)
  host_url = `http://trainingapi.ridewaretech.com/`;
  body = {
    "searchKeyword": "test",
    "pageIndex": 0,
    "pageSize": 0
  }

  constructor() { }

  loginUser(user: loginUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.host_url}User/Login`, user).pipe(
      map((response) => {

        this.setTokens(response.data)
        return response;
      }),
      catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      })
    );
  }

  getCompanyInfo(companyId: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.host_url}Company/GetCompanyById`, { id: companyId }).pipe(
      map((res) => {
        return res;
      }), catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))
  }


  editCompanyInfo(cInfo: companyInfo) {
    return this.http.post<LoginResponse>(`${this.host_url}Company/UpdateCompany`, cInfo,).pipe(
      map((res) => {
        return res;
      }), catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))
  }

  getAllEmployees() {
    return this.http.post<LoginResponse>(`${this.host_url}Employee/GetAllEmployees`, this.body,).pipe(
      map((res) => {
        return res;
      }), catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))
  }

  updateEmployee(employee: employee) {
    return this.http.post<LoginResponse>(`${this.host_url}Employee/UpdateEmployee`, employee,).pipe(
      map((res) => {
        return res;
      }), catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))
  }

  addNewEmployee(employee: newUser) {
    return this.http.post<LoginResponse>(`${this.host_url}Employee/CreateEmployee`, employee,).pipe(
      map((res) => {
        return res;
      }), catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))
  }

  deleteEmployee(employee: employee) {
    return this.http.post<LoginResponse>(`${this.host_url}Employee/UpdateEmployee`, employee,).pipe(
      map((res) => {
        return res;
      }), catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))
  }

  setTokens(userData: User) {
    this.accessToken.set(userData.token ?? '');
    this.refreshToken.set(userData.refreshToken ?? '');
    this.userId.set(userData.id)
    this.userDataSignal.set(userData);
    localStorage.setItem('aToken', this.accessToken())
    localStorage.setItem('rToken', this.refreshToken())
  }

  get accessTokenValue() {
    return this.accessToken()
  }

  get refreshTokenValue() {
    return this.refreshToken()
  }

  get UserData() {
    return this.userDataSignal;
  }

  clearTokens() {
    this.accessToken.set('');
    this.refreshToken.set('');
    localStorage.removeItem('aToken')
    localStorage.removeItem('rToken')
  }

  refreshAccessToken() {
    console.log(this.userId());

    const refreshTokenBody =
    {
      id: this.userId(),
      refreshToken: this.refreshToken(),
      clientId: this.clientId()
    }
    return this.http.post<LoginResponse>(`${this.host_url}User/RevokeRefreshToken`, refreshTokenBody
    ).pipe(
      map((res) => {
        if (res.isValid && res.data.token) {
          this.setTokens(res.data);
          return res.data.token;
        }
        return res;
      }), catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))

  }
}

