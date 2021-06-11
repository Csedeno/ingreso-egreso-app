import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/sercices/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  logout(): void {
    Swal.fire({
      title: 'Cerrando sesión',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.authService.logout().then(() => {
      Swal.close();
      this.router.navigateByUrl('/login');
    }
    );
  }
}
