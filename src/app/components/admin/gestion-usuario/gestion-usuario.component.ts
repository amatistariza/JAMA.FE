import { Component, OnInit } from '@angular/core';
import { GestionUsuarioService } from '../../../services/gestion-usuario.service';
import { Usuario } from '../../../models/usuario';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.css']
})
export class GestionUsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosPaginados: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;
  filtro: string = '';
  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false; // Booleano directo

  constructor(private usuarioService: GestionUsuarioService) {
  }

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
    this.usuarioSeleccionado = this.inicializarUsuario(); // Inicializa el formulario
    this.mostrarFormulario = true;
  }
  inicializarUsuario(): Usuario {
    return {
      id: 0,
      nombreUsuario: '',
      password: '',
      rolUser: ''
    };
  }

  editItem(usuario: Usuario): void {
    this.modoFormulario = 'editar';
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarFormulario = true;
  }

  guardarUsuario(usuario: Usuario): void {
    if (this.modoFormulario === 'crear') {
      this.usuarioService.addUsuario(usuario).subscribe(() => this.loadUsuarios());
    } else {
      this.usuarioService.editUsuario(usuario.id, usuario.nombreUsuario,usuario.password).subscribe(() => this.loadUsuarios());
    }
    this.mostrarFormulario = false;
  }

    eliminarUsuario(id: number): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.deleteUsuario(id).subscribe(
            () => {
              this.loadUsuarios();
              Swal.fire('Eliminado', 'El paciente ha sido eliminado con éxito.', 'success');
            },
            (error) => {
              console.error('Error al eliminar el paciente:', error);
              Swal.fire('Error', 'No se pudo eliminar el paciente', 'error');
            }
          );
        }
      });
    }
  

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}