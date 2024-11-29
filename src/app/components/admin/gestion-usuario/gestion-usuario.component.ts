import { Component, OnInit } from '@angular/core';
import { GestionUsuarioService } from '../../services/gestion-usuario.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.css']
})
export class GestionUsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: GestionUsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        console.log('Usuarios cargados:', this.usuarios);
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  addItem(): void {
    const nuevoUsuario: Usuario = {
      id: 0,  
      nombreUsuario: 'String',
      rolUser: 'ADMINISTRADOR',
      password: 'yyyyyyy',
    };
    this.usuarioService.addUsuario(nuevoUsuario).subscribe(() => {
      this.loadUsuarios();
    });
  }

  editItem(id: number): void {
    this.usuarioService.getUsuarioById(id).subscribe((usuario) => {
      if (usuario) {
        const usuarioEditada: Usuario = { ...usuario, nombreUsuario: 'Actualizado' };
        this.usuarioService.editUsuario(id, usuarioEditada).subscribe(() => {
          this.loadUsuarios();
        });
      }
    });
  }

  deleteItem(id: number): void {
    this.usuarioService.deleteUsuario(id).subscribe(() => {
      this.loadUsuarios();
    });
  }
}