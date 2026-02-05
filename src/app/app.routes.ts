import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Home } from './home/home';
import { Newpost } from './newpost/newpost';
import { Myposts } from './myposts/myposts';
import { Savedposts } from './savedposts/savedposts';
import { Viewpost } from './viewpost/viewpost';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'newpost', component: Newpost },
    { path: 'myposts', component: Myposts },
    { path: 'savedposts', component: Savedposts },
    { path: 'viewpost/:postId', component: Viewpost }

];
