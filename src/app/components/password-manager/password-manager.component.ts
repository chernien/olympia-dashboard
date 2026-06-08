import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.css']
})
export class PasswordManagerComponent implements OnInit {
  contacts: any[] = []; 
  selectedContact: any = null; 
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.fetchContacts();
  }


  fetchContacts(): void {
    this.clientService.getRoleContact().subscribe(
      (data: any) => {
        this.contacts = data;
        console.log('Contacts récupérés :', this.contacts);
      },
      (error) => {
        console.error('Erreur lors de la récupération des contacts :', error);
      }
    );
  }

  selectContact(contact: any): void {
    this.selectedContact = contact;
  }

  onChangePassword(): void {
    this.successMessage = '';
    this.errorMessage = '';
  
    if (this.newPassword === this.confirmPassword) {
      const changePasswordRequest = {
        username: this.selectedContact.username,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      };
  
      this.clientService.changePassword(changePasswordRequest).subscribe(
        (response) => {
        Swal.fire({
          icon: 'success',
          text: 'Mot de passe modifié'
        })
          this.newPassword = '';
          this.oldPassword = '';
          this.confirmPassword = '';
        },
        (error) => {
        Swal.fire({
          icon: 'error',
          text: 'Mot de passe non valide !'
        })        }
      );
    } else {
              Swal.fire({
                icon: 'error',
                text: 'Les mots de passe ne correspondent pas!'
              })
    }
  }
  
  showMessage(message: string, type: 'success' | 'error'): void {
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
      alertBox.classList.add('fade-out');
      setTimeout(() => alertBox.remove(), 1000);
    }, 3000);
  }
  
  
  
}
