import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener(): void {
    this.auth.authState.subscribe(fUser => {
      if (fUser) {
       this.userSubscription = this.firestore.doc(`${fUser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
            console.log(firestoreUser);
            const user = Usuario.fromFirebase(firestoreUser);
            this.store.dispatch(authActions.setUser({ user: user }));
          });
      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    }
    );
  }

  crearUsuario(nombre: string, email: string, password: string): Promise<any> {
    console.log({ nombre, email, password });
    return this.auth.createUserWithEmailAndPassword(email, password).then(
      ({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
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
