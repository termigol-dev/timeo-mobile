// Mapa visual y textual de incidencias para la app del empleado

export const INCIDENT_UI = {
  IN_EARLY: {
    label: 'CHECK IN temprano',
    color: 'yellow',
  },
  IN_LATE: {
    label: 'CHECK IN tardío',
    color: 'orange',
  },
  OUT_EARLY: {
    label: 'CHECK OUT temprano',
    color: 'orange',
  },
  OUT_LATE: {
    label: 'CHECK OUT tardío',
    color: 'yellow',
  },
  FORGOT_IN: {
    label: 'Olvido de CHECK IN',
    color: 'green',
  },
  FORGOT_OUT: {
    label: 'Olvido de CHECK OUT',
    color: 'green',
  },
  WRONG_IN: {
    label: 'CHECK IN por error',
    color: 'green',
  },
  WRONG_OUT: {
    label: 'CHECK OUT por error',
    color: 'green',
  },
  NO_SHOW: {
    label: 'Sin registros en el turno',
    color: 'red',
  },
  ADMIN_NOTE: {
    label: 'Nota del administrador',
    color: 'gray',
  },
};

// Helper seguro
export function getIncidentUi(type) {
  return (
    INCIDENT_UI[type] || {
      label: type,
      color: 'gray',
    }
  );
}