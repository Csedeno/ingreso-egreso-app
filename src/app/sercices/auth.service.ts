import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore) { }

  initAuthListener(): void {
    this.auth.authState.subscribe(fUser =>
      console.log(fUser));
  }

  crearUsuario(nombre: string, email: string, password: string): Promise<any> {
    console.log({ nombre, email, password });
    return this.auth.createUserWithEmailAndPassword(email, password).then(
      ({user}) => {
        const newUser = new Usuario( user.uid, nombre, user.email);
        this.firestore.doc(`${user.uid}/usuario`).set( {...newUser});
      }
    );
  }

  loginUsuario(email: string, password: string): Promise<any> {
    console.log({ email, password });
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    return this.auth.signOut();
  }

  isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(fUser => fUser != null)
    );
  }
}
