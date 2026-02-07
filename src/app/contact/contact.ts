import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-contact',
  imports: [Navbar, Sidebar],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

}
