export interface Usuario {
  id: number;
  nombreUsuario: string;
  password: string;
  rolUser: string; // changed to match backend model property name
}

export interface CambiarPasswordDTO {
  passwordAnterior: string;
  nuevaPassword: string;
}