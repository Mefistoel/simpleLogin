import { Component, OnInit } from "@angular/core";
import { UsuarioModel } from "../../models/usuario.models";
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';

import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";


@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"]
})
export class RegistroComponent implements OnInit {
  usuarioModel: UsuarioModel;
  recordar = false;
  constructor(private auth: AuthService, private router: Router) {
    this.usuarioModel = new UsuarioModel();
  }

  ngOnInit() {}

  onSubmit(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    if (forma.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      type: "info",
      text: "Espere por favor"
    });
    Swal.showLoading();
    this.auth.nuevoUsuario(this.usuarioModel).subscribe(
      resp => {
        if (this.recordar) {
          sessionStorage.setItem("email", this.usuarioModel.email);
        }
        Swal.close();
        this.router.navigateByUrl('/home');
      },
      err => {
        Swal.fire({
          allowOutsideClick: false,
          type: "error",
          title: "Error al crear cuenta",
          text: err.error.error.message
        });
      }
    );
  }
}
