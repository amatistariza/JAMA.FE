export interface Usuario {
    id: number;
    nombreUsuario: string;
    rolUser: 'ADMINISTRADOR' | 'ENFERMERA' | null;
    password: string;
  }  