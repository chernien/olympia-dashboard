import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent {
  constructor(private router: Router) {}

  managePasswords() {
    this.router.navigate(['/home/password-manager']);
  }

  goToStore() {
    this.router.navigate(['/home']); 
  }
}
