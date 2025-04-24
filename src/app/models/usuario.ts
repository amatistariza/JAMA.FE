export interface Usuario {
  id: number;
  nombreUsuario: string;
  password: string;
  rolUser: string;
}

export interface CambiarPasswordDTO {
  passwordAnterior: string;
  nuevaPassword: string;
}