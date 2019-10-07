import { Component, OnInit } from "@angular/core";
import { UsuarioModel } from "../../models/usuario.models";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel;
  recordar = false;
  constructor(private auth: AuthService, private router: Router) {
    this.usuario = new UsuarioModel();
  }

  ngOnInit() {
    if (sessionStorage.getItem("email")) {
      this.usuario.email = sessionStorage.getItem("email");
      this.recordar = true;
    }
  }
  onSubmit(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      type: "info",
      text: "Espere por favor"
    });
    Swal.showLoading();
    this.auth.login(this.usuario).subscribe(
      resp => {

        if (this.recordar) {
          sessionStorage.setItem("email", this.usuario.email);
        }
        Swal.close();
        this.router.navigateByUrl("/home");
      },
      err => {
        Swal.fire({
          allowOutsideClick: false,
          type: "error",
          title: "Error de autenticacion",
          text: err.error.error.message
        });
      }
    );
  }
}
