import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioModel } from "src/app/models/usuario.models";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  // Crear usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  private url = "https://identitytoolkit.googleapis.com/v1/accounts";
  private API_KEY = "AIzaSyCYFbIvqX11uYMs3ypJdOK4qFmxwbnfPcM";
  private userToken = "";
  private expire: number;
  private respToken = "idToken";
  private respExpire = "expiresIn";
  constructor(private http: HttpClient) {}

  // Crear usuario
  // :signUp?key=[API_KEY]
  nuevoUsuario(usuario: UsuarioModel) {
    /*const autData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };*/
    // Esto es igual al de arriba
    const autData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http
      .post(`${this.url}:signUp?key=${this.API_KEY}`, autData)
      .pipe(
        map(resp => {
          this.guardarToken(resp[this.respToken]);
          this.expire = resp[this.respToken];
          return resp;
        })
      );
  }

  // login
  // :signInWithPassword?key=[API_KEY]
  login(usuario: UsuarioModel) {
    const autData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http
      .post(`${this.url}:signInWithPassword?key=${this.API_KEY}`, autData)
      .pipe(
        map(resp => {
          this.guardarToken(resp[this.respToken]);
          this.expire = resp[this.respToken];
          return resp;
        })
      );
  }

  // Logout
  logout() {
    localStorage.removeItem("token");
  }

  // Guardar token
  guardarToken(idtoken: string) {
    this.userToken = idtoken;
    localStorage.setItem("token", idtoken);
    const hoy = new Date();
    hoy.setSeconds(this.expire);
    localStorage.setItem("expire", hoy.getDate().toString());
  }

  // getToken
  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }
    return this.userToken;
  }

  autenticado() {
    if (this.userToken.length < 2) {
      return false;
    }
    const expiraN = Number(localStorage.getItem("expira"));
    const expira = new Date();
    expira.setTime(expiraN);
    if (expira < new Date()) {
      return false;
    } else {
      return true;
    }
  }
}
