import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/sercices/auth.service';
import * as uiActions from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading,
        console.log('Cargando subscripcion');
    });

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(): void {
    this.store.dispatch(uiActions.isLoading())
    if (this.registroForm.invalid) { return; }
    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password).then(credenciales => {
      console.log(credenciales);
      // Swal.close();
      this.store.dispatch(uiActions.stopLoading());
      this.router.navigateByUrl('/');
    })
      .catch(
        err => {
          this.store.dispatch(uiActions.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          })
        }
      );
  }

}
