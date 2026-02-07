import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-privacypolicy',
  imports: [Navbar, Sidebar],
  templateUrl: './privacypolicy.html',
  styleUrl: './privacypolicy.css',
})
export class Privacypolicy {

}
