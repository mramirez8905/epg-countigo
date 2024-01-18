interface IUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  descripcion: string | undefined;
  tipoUsuario: string | undefined;
  activo: boolean;
  superUsuario: boolean;
  createdAt: string;
  updatedAt: string;
  nombre: string;
}
