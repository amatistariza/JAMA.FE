import { Component, OnInit } from '@angular/core';
import { GestionUsuarioService } from '../../../services/gestion-usuario.service';
import { Usuario } from '../../../models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.css']
})
export class GestionUsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosPaginados: Usuario[] = [];
  filtro: string = '';
  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  usuarioSeleccionada: Usuario | null = null;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false; // Booleano directo

  constructor(private usuarioService: GestionUsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosPaginados = [...this.usuarios];
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  filtrarUsuarios(): void {
    this.usuariosPaginados = this.usuarios.filter((usuario) =>
      usuario.nombreUsuario.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.usuarioSeleccionada = {
      id: 0,
      nombreUsuario: '',
      rolUser: null,
      password: '',
    };
    this.mostrarFormulario = true;
  }

  editItem(usuario: Usuario): void {
    this.modoFormulario = 'editar';
    this.usuarioSeleccionada = { ...usuario };
    this.mostrarFormulario = true;
  }

  guardarUsuario(usuario: Usuario): void {
    if (this.modoFormulario === 'crear') {
      this.usuarioService.addUsuario(usuario).subscribe(() => this.loadUsuarios());
    } else {
      this.usuarioService.editUsuario(usuario.id, usuario).subscribe(() => this.loadUsuarios());
    }
    this.mostrarFormulario = false;
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}