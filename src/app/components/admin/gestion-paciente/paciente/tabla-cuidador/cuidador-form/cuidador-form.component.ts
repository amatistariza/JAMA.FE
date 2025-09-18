import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cuidador } from '../../../../../../models/cuidador';
import { CuidadorService } from '../../../../../../services/cuidador.service';
import Swal from 'sweetalert2';

const ValidationMessages = {
  required: 'Este campo es obligatorio',
  minlength: 'El valor es demasiado corto'
};

// Añadir mensaje para email
ValidationMessages['email'] = 'Formato de correo inválido';

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
      parentesco: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required, Validators.email]],
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
      // Prefer server-provided error set via setErrors({ server: '...' })
      if (control.errors['server']) {
        return control.errors['server'];
      }
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages] || '';
    }
    return '';
  }

  guardar(): void {
  if (this.cuidadorForm.valid) {
    const cuidadorData = this.cuidadorForm.value;
    const payload = this.cuidador && this.cuidador.id ? { id: this.cuidador.id, ...cuidadorData } : cuidadorData;

    const request$ = this.modo === 'crear'
      ? this.cuidadorService.addCuidador(payload)
      : this.cuidadorService.editCuidador(this.cuidador?.id, payload);

      request$.subscribe({
        next: () => {
          Swal.fire('Éxito', `Cuidador ${this.modo === 'crear' ? 'creado' : 'actualizado'} correctamente`, 'success');
          this.onGuardar.emit();
        },
        error: (error) => {
          console.error('Error:', error);
          // If backend returns a structured validation response, handle it
          if (error && error.status === 400) {
            // If backend sends a simple message { mensaje: '...' }
            if (error.error && error.error.mensaje) {
              Swal.fire('Error', error.error.mensaje, 'error');
              return;
            }

            // If backend sent field errors like { errors: { field: ['msg'] } }
            if (error.error && error.error.errors) {
              const errors = error.error.errors;
              const messages: string[] = [];
              Object.keys(errors).forEach(key => {
                const fieldKey = key.toString();
                const fieldControl = this.cuidadorForm.get(fieldKey) || this.cuidadorForm.get(this.normalizeFieldName(fieldKey));
                const fieldMsgs = errors[key];
                const combined = Array.isArray(fieldMsgs) ? fieldMsgs.join(', ') : String(fieldMsgs);
                messages.push(`${this.displayFieldName(fieldKey)}: ${combined}`);
                if (fieldControl) {
                  fieldControl.setErrors({ server: combined });
                  fieldControl.markAsTouched();
                }
              });
              Swal.fire('Errores de validación', messages.join('<br/>'), 'error');
              return;
            }

            // If error.error is empty object, show a generic friendly message
            if (error.error && Object.keys(error.error).length === 0) {
              // mark controls touched to reveal client-side errors
              Object.keys(this.cuidadorForm.controls).forEach(field => {
                const control = this.cuidadorForm.get(field);
                control?.markAsTouched();
              });
              Swal.fire('Error', 'La solicitud no pasó la validación. Por favor revise los campos y vuelva a intentar.', 'error');
              return;
            }
          }

          // Fallback generic error
          Swal.fire('Error', `Error al ${this.modo === 'crear' ? 'crear' : 'actualizar'} el cuidador`, 'error');
        }
      });
    } else {
      // marcar todos los controles como tocados para mostrar errores
      Object.keys(this.cuidadorForm.controls).forEach(field => {
        const control = this.cuidadorForm.get(field);
        control?.markAsTouched();
      });
      Swal.fire('Error', 'Por favor complete los campos obligatorios y corrija los errores.', 'error');
    }
  }

  cancelar(): void {
    this.onCancelar.emit();
  }

  // Normalize backend field names to form control names (simple heuristic)
  private normalizeFieldName(field: string): string {
    // examples: 'correoElectronico' stays the same, 'correo_electronico' -> 'correoElectronico'
    return field.replace(/[_\s]+([a-zA-Z])/g, (_, c) => c.toUpperCase());
  }

  // Provide a friendly display name for a field key
  private displayFieldName(field: string): string {
    const map: { [k: string]: string } = {
      correoElectronico: 'Correo electrónico',
      numeroIdentificacion: 'Número de identificación',
      primerNombre: 'Primer nombre',
      primerApellido: 'Primer apellido',
      tipoIdentificacion: 'Tipo de identificación',
      parentesco: 'Parentesco'
    };
    const normalized = this.normalizeFieldName(field);
    return map[normalized] || normalized;
  }
}
