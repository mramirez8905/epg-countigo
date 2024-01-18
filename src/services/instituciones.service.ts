import { IInstituciones, IInstitucionesResponse } from '@/interfaces/instituciones.interface';
import { BaseApi } from './base/baseServiceApi';

class InstitucionesService extends BaseApi<IInstitucionesResponse, IInstituciones> {
  constructor() {
    super('/institucions');
  }
}

export const institucionesService = new InstitucionesService();
