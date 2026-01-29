import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Home } from './home/home';


export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    {
        path: '', component: Home, pathMatch: 'full', children: [

        ]
    }
];
