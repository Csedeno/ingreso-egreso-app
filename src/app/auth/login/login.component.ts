import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) { }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading,
        console.log('Cargando subscripcion');
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario(): void {
    this.store.dispatch(uiActions.isLoading());

    // Swal.fire({
    //   title: 'Un segundo...',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });
    if (this.loginForm.invalid) { return; }
    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password).then(
      credenciales => {
        console.log(credenciales);
        this.store.dispatch(uiActions.stopLoading()),
          // Swal.close();
          this.router.navigateByUrl('/');
      }
    ).catch(
      err => {
        this.store.dispatch(uiActions.stopLoading()),
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          });
      }
    );



  }


}
