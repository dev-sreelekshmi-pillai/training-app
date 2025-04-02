import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'company/:cid', component: CompanyInfoComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route
];
