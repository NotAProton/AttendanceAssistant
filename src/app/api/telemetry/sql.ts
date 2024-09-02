export type TelemetryRow = {
  time: string;
  trigger: string;
  ip: string;
  ua: string;
  clientId: string;
  value?: string;
};

export async function insertTelemetry(db: D1Database, telemetry: TelemetryRow) {
  await db
    .prepare(
      "INSERT INTO telemetry (time, trigger, ip, ua, client_id, value) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(
      telemetry.time,
      telemetry.trigger,
      telemetry.ip,
      telemetry.ua,
      telemetry.clientId,
      telemetry.value || null
    )
    .run();
}
