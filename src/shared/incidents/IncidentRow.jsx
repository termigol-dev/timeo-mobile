import { INCIDENT_UI } from '@/shared/incidents/incidentUi';

export function IncidentRow({ incident }) {
  const ui = INCIDENT_UI[incident.type];

  if (!ui) return null;

  return (
    <div className="incident-row">
      <span
        className="incident-dot"
        style={{ backgroundColor: ui.color }}
      />
      <span className="incident-text">
        {incident.type === 'ADMIN_NOTE'
          ? incident.note
          : ui.label}
      </span>
    </div>
  );
}