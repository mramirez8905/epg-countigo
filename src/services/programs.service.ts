import { IProgram, IProgramResponse } from '@/interfaces/program.interface';
import { BaseApi } from './base/baseServiceApi';

class ProgramsService extends BaseApi<IProgramResponse, IProgram> {
  constructor() {
    super('/programs');
  }
}

export const programService = new ProgramsService();
