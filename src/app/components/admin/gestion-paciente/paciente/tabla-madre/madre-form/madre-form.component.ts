import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Madre } from '../../../../../../models/madre';
import { MadreService } from '../../../../../../services/madre.service';
import { ValidationMessages } from '../../../../../shared/form-validation-messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-madre-form',
  templateUrl: './madre-form.component.html',
  styleUrl: './madre-form.component.css'
})
export class MadreFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() madre: Madre | null = null;
  @Output() onGuardar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  madreForm: FormGroup;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder, private madreService: MadreService) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.modo === 'editar' && this.madre) {
      this.madreForm.patchValue(this.madre);
    }
  }

  private initForm(): void {
    this.madreForm = this.fb.group({
      tipoIdentificacion: ['', [Validators.required]],
      numeroIdentificacion: ['', [Validators.required, Validators.minLength(5)]],
      primerNombre: ['', [Validators.required, Validators.minLength(2)]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required, Validators.minLength(2)]],
      segundoApellido: [''],
      correoElectronico: ['', [Validators.required, Validators.email]],

      telefonoFijo: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      regimenAfiliacion: ['', [Validators.required]],
      pertenenciaEtnica: ['', [Validators.required]],
      desplazado: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.madreForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.madreForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardar(): void {
    if (this.madreForm.valid) {
      const madreData = this.madreForm.value;
      
      const request$ = this.modo === 'crear' 
        ? this.madreService.addMadre(madreData)
        : this.madreService.editMadre(this.madre!.id, madreData);

      request$.subscribe({
        next: () => {
          Swal.fire('Éxito', `Madre ${this.modo === 'crear' ? 'creada' : 'actualizada'} correctamente`, 'success');
          this.onGuardar.emit();
        },
        error: (error) => {
          console.error('Error:', error);
          // Si el backend devuelve un mensaje simple
          if (error && error.error && error.error.mensaje) {
            Swal.fire('Error', error.error.mensaje, 'error');
            return;
          }

          // Si el backend devuelve errores por campo (validation errors)
          if (error && error.error && error.error.errors) {
            const errorsObj = error.error.errors;
            const messages: string[] = [];
            Object.keys(errorsObj).forEach((key) => {
              const msgs = errorsObj[key] as string[];
              const controlName = key.charAt(0).toLowerCase() + key.slice(1);
              const control = this.madreForm.get(controlName);
              if (control) {
                control.setErrors({ server: msgs.join(' - ') });
                control.markAsTouched();
              }
              messages.push(`${controlName}: ${msgs.join(', ')}`);
            });
            Swal.fire({ icon: 'error', title: 'Errores', html: messages.join('<br>') });
            return;
          }

          Swal.fire('Error', `Error al ${this.modo === 'crear' ? 'crear' : 'actualizar'} la madre`, 'error');
        }
      });
    }
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
