import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  formClient: FormGroup
  loginForm: FormGroup
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!)
  userconnect: any
  categories: any

  constructor(private clientService: ClientService, private formBuilder: FormBuilder, private route: Router, private articleService: ArticleService) { }

  ngOnInit() {
    this.userconnect = localStorage.getItem("Client")

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.formClient = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      companyName:['', Validators.required],
      townCity:['', Validators.required],
      postcode:['', Validators.required],
      streetAddress: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  saveClient(): void {
    if (this.formClient.invalid) {
      alert("Invalid");

      return;
    }

    

    this.clientService.saveClient(this.formClient.value).subscribe(
      (res: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Votre compte a été crée avec succés',
          showConfirmButton: false,
          timer: 1500
        })
        this.formClient.reset()
      },
      (error: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Des données manquantes',
          showConfirmButton: false,
          timer: 1500
        })
      }
    );
  }


  isCommercialContact(): boolean {
  const contact = JSON.parse(localStorage.getItem("Contact")!);

  if (!contact || !contact.tiers) {
    return false;
  }

  return contact.tiers.trim().startsWith('COM');
}

  onLogin() {
    this.clientService.Login(this.loginForm.value).subscribe(
      (res: any) => {
        localStorage.setItem("Client", JSON.stringify(res));
        localStorage.setItem("loggedIn", JSON.stringify(true))
        this.loginForm.reset()
        window.location.reload()
        Swal.fire({
          icon: 'success',
          text: 'BIENVENUE À LANG'
        })

      }, err => {
        Swal.fire({
          icon: 'error',
          text: 'Identifiant ou mot de passe non valide !'
        })
      }
    )
  }
  getCategory() {
    this.articleService.getCategory().subscribe(
      (res: any) => {
        this.categories = res;
      }
    )
  }

}
