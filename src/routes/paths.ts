const ROOTS = {
  LOGIN: "/login",
  EPG: "/epg_app",
};

export const paths = {
  login: {
    root: ROOTS.LOGIN,
  },
  epg: {
    root: ROOTS.EPG,
    channels: `${ROOTS.EPG}/canales`,
    programs: `${ROOTS.EPG}/programas`,
    nomencladores: `${ROOTS.EPG}/nomencladores`,
    users: `${ROOTS.EPG}/users`,
    programacion: `${ROOTS.EPG}/programacion`,
    editProgramacion:(id: string | number) => `${ROOTS.EPG}/programacion/${id}`,
  },
};
