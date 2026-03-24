export interface AuditLog {
  actorId: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValue?: any;
  newValue?: any;
  traceId?: string;
}

export async function auditLog(data: AuditLog) {
  console.log('AUDIT_LOG', data);
}
