
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { companyInfo, employee, LoginResponse, loginUser, newUser } from '../model/model';
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
        this.userId.set(response.data.id)
        console.log(this.userId());

        this.setTokens(response.data.token, response.data.refreshToken)
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
        console.log("service udpate res", res);
        return res;
      }), catchError((error) => {
        console.error('Error fetching courses:', error);
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))
  }

  setTokens(aToken: string, rToken: string) {
    console.log("Atoken", aToken);
    console.log("rtoken", rToken);
    this.accessToken.set(aToken);
    this.refreshToken.set(rToken);
    localStorage.setItem('aToken', this.accessToken())
    localStorage.setItem('rToken', this.refreshToken())

  }

  get accessTokenValue() {
    return this.accessToken()
  }

  get refreshTokenValue() {
    return this.refreshToken()
  }

  clearTokens() {
    // this.accessToken.set('');
    // this.refreshToken.set('');
    // localStorage.removeItem('aToken')
    // localStorage.removeItem('rToken')
  }

  refreshAccessToken() {
    const refreshbody =
    {
      'id': "44c6ef47-e562-4230-9ec6-63bdc3b2e3f9",
      'refreshToken': this.refreshToken(),
      'clientId': "ERPWebApp"
    }
    return this.http.post<LoginResponse>(`${this.host_url}User/RevokeRefreshToken`, {}
    ).pipe(
      map((res) => {
        console.log("refershed");
        return res;
      }), catchError((error) => {
        return throwError(() => new Error(error.message || 'Something went wrong!'));
      }))

  }
}

