import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Home } from './home/home';

export const routes: Routes = [
    { path: '', component: Login, pathMatch: 'full' },
    { path: 'signup', component: Signup },
    {
        path: 'home', component: Home, children: [

        ]
    }
];
