import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-about',
  imports: [Navbar, Sidebar],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

}
