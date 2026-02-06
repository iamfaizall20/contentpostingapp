import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Home } from './home/home';
import { Newpost } from './newpost/newpost';
import { Myposts } from './myposts/myposts';
import { Savedposts } from './savedposts/savedposts';
import { Viewpost } from './viewpost/viewpost';
import { About } from './about/about';
import { Privacypolicy } from './privacypolicy/privacypolicy';
import { Termsofuse } from './termsofuse/termsofuse';
import { Contact } from './contact/contact';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'newpost', component: Newpost },
    { path: 'myposts', component: Myposts },
    { path: 'savedposts', component: Savedposts },
    { path: 'viewpost/:postId', component: Viewpost },
    { path: 'about', component: About },
    { path: 'privacypolicy', component: Privacypolicy },
    { path: 'termsofuse', component: Termsofuse },
    { path: 'contact', component: Contact }

];
