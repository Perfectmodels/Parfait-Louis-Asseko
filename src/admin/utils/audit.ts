import { AppData } from '../../hooks/useDataStore';
import { AdminUser, AuditLogEntry, AuditLogAction } from '../../types';

export const getCurrentAdmin = (data: AppData | null): AdminUser | null => {
  if (!data) return null;
  const adminId = sessionStorage.getItem('admin_id');
  return (data.adminUsers || []).find((a) => a.id === adminId) || null;
};

export const createAuditEntry = (
  actor: Pick<AdminUser, 'id' | 'name' | 'role'> | null,
  action: AuditLogAction,
  entity: { type: string; id?: string; name?: string },
  details?: string
): AuditLogEntry => {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    actor: actor
      ? { id: actor.id, name: actor.name, role: actor.role }
      : { id: 'system', name: 'Système', role: 'System' },
    action,
    entity,
    details,
  };
};

export const appendAudit = (data: AppData, entry: AuditLogEntry): AppData => {
  const limit = 1000; // keep last 1000 entries
  const current = Array.isArray(data.auditLog) ? data.auditLog : [];
  const next = [...current, entry];
  return { ...data, auditLog: next.slice(-limit) };
};
