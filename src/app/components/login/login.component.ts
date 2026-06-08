import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formClient: FormGroup
  loginForm: FormGroup
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!)
  userconnect: any
  categories: any
  userconnectcomm: any
  userconnectcontact: any
  connected = false
  clients: any
  role = JSON.parse(localStorage.getItem("role")!)

  constructor(private clientService: ClientService, private formBuilder: FormBuilder, private route: Router, private articleService: ArticleService) { }


  ngOnInit() {
    this.userconnect = localStorage.getItem("Client")
    this.userconnectcomm = localStorage.getItem("Commercial")
    this.userconnectcontact = localStorage.getItem("Contact")
    if (this.loggedIn == true) {
      this.route.navigateByUrl('/home')
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.formClient = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      streetAddress: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.getClients()
  }
  getClients() {
    this.clientService.getClients().subscribe(
      (res: any) => {
        this.clients = res;
        //console.log(res)
      });
  }
  saveClient(): void {
    if (this.formClient.invalid) {
      alert("Invalid");

      return;
    }

    this.clientService.saveClient(this.formClient.value).subscribe(
      (res: any) => {
        console.log("okkk");
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

  onLogin() {
    this.clientService.Login(this.loginForm.value).subscribe(
      (res: any) => {
        this.connected==true
        // localStorage.setItem("Role", JSON.stringify(res.role))
        localStorage.setItem("Client", JSON.stringify(res));
        localStorage.setItem("loggedIn", JSON.stringify(true))
        localStorage.setItem("role", JSON.stringify("Client"))
        window.location.reload()

        this.route.navigateByUrl('/home')
        this.loginForm.reset()
        Swal.fire({
          icon: 'success',
          text: 'BIENVENUE À Olympia'
        })
        this.route.navigateByUrl('/home')

      }, (err: any) => {
        Swal.fire({
          icon: 'error',
          text: 'Identifiant ou mot de passe non valide !'
        })
      }
    )
  }
  onLoginComm() {
    // console.log(this.loginForm.value)
    this.clientService.Login2(this.loginForm.value).subscribe(
      (res: any) => {

        // localStorage.setItem("Role", JSON.stringify(res.role))
        localStorage.setItem("Commercial", JSON.stringify(res))
        localStorage.setItem("loggedIn", JSON.stringify(true))
        localStorage.setItem("role", JSON.stringify("Commercial"))
        this.connected==true
        window.location.reload()
        this.route.navigateByUrl('/home')
        this.loginForm.reset()
        Swal.fire({
          icon: 'success',
          text: 'BIENVENUE À Olympia'
        })
        this.route.navigateByUrl('/home')

      }, (err: any) => {
        Swal.fire({
          icon: 'error',
          text: 'Identifiant ou mot de passe non valide !'
        })
      }
    )
  }
  onLoginContact() {
  this.clientService.LoginT2(this.loginForm.value).subscribe(
    (res: any) => {

      const t2 = res.t2;
      const auth = res.authentication;

      // 🔥 construire objet final comme tu veux
      const contactData = {
        ...t2,
        dos: auth.dos,          // 🔥 overwrite propre
        etb: auth.etb.trim() ,   // ⚠️ trim important
        depot: auth.depot.trim()
      };

      // 🔥 stockage final
      localStorage.setItem("Contact", JSON.stringify(contactData));

      localStorage.setItem("loggedIn", JSON.stringify(true));
      localStorage.setItem("role", JSON.stringify("Contact"));

      this.connected = true;

      window.location.reload();
      this.route.navigateByUrl('/home');
      this.loginForm.reset();

      Swal.fire({
        icon: 'success',
        text: 'BIENVENUE À OLYMPIA'
      });

    }, (err: any) => {
      Swal.fire({
        icon: 'error',
        text: 'Identifiant ou mot de passe non valide !'
      });
    }
  );
}
  getCategory() {
    this.articleService.getCategory().subscribe(
      (res: any) => {
        this.categories = res;
      }
    )
  }

}
