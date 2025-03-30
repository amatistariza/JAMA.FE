import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cuidador } from '../../../../../../models/cuidador';
import { CuidadorService } from '../../../../../../services/cuidador.service';
import Swal from 'sweetalert2';

const ValidationMessages = {
  required: 'Este campo es obligatorio',
  minlength: 'El valor es demasiado corto'
};

@Component({
  selector: 'app-cuidador-form',
  templateUrl: './cuidador-form.component.html',
  styleUrls: ['./cuidador-form.component.css']
})
export class CuidadorFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() cuidador: Cuidador | null = null;
  @Output() onGuardar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  cuidadorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cuidadorService: CuidadorService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.cuidadorForm = this.fb.group({
      tipoIdentificacion: ['', [Validators.required]],
      numeroIdentificacion: ['', [Validators.required, Validators.minLength(5)]],
      primerNombre: ['', [Validators.required, Validators.minLength(2)]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required, Validators.minLength(2)]],
      segundoApellido: [''],
      parentesco: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.modo === 'editar' && this.cuidador) {
      this.cuidadorForm.patchValue(this.cuidador);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.cuidadorForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.cuidadorForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardar(): void {
    if (this.cuidadorForm.valid) {
      const cuidadorData = this.cuidadorForm.value;
      
      const request$ = this.modo === 'crear' 
        ? this.cuidadorService.addCuidador(cuidadorData)
        : this.cuidadorService.editCuidador(this.cuidador!.id, cuidadorData);

      request$.subscribe({
        next: () => {
          Swal.fire('Éxito', `Cuidador ${this.modo === 'crear' ? 'creado' : 'actualizado'} correctamente`, 'success');
          this.onGuardar.emit();
        },
        error: (error) => {
          console.error('Error:', error);
          Swal.fire('Error', `Error al ${this.modo === 'crear' ? 'crear' : 'actualizar'} el cuidador`, 'error');
        }
      });
    }
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
