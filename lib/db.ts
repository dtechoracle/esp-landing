import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "esp.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("synchronous = NORMAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'event_planner',
    whatsapp_on INTEGER NOT NULL DEFAULT 0,
    phone TEXT,
    source TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    total INTEGER NOT NULL DEFAULT 0,
    sent INTEGER NOT NULL DEFAULT 0,
    failed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS mail_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    email TEXT NOT NULL,
    subject TEXT,
    status TEXT NOT NULL,
    error TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
  );
`);

// Idempotent migrations for existing databases.
function ensureColumn(table: string, column: string, ddl: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  }
}
ensureColumn("subscribers", "name", "name TEXT");
ensureColumn("subscribers", "remote_id", "remote_id TEXT");
ensureColumn("subscribers", "deleted_at", "deleted_at TEXT");
ensureColumn("admin_sessions", "backend_token", "backend_token TEXT");
db.exec(
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_remote_id ON subscribers(remote_id)`
);

// Migrate old role values to new ones
db.exec(`UPDATE subscribers SET role = 'event_planner' WHERE role = 'planner'`);
db.exec(`UPDATE subscribers SET role = 'venue_staff' WHERE role = 'venue'`);
db.exec(`UPDATE subscribers SET role = 'venue_staff' WHERE role = 'venue_owner'`);

export type Subscriber = {
  id: number;
  email: string;
  name: string | null;
  role: "event_planner" | "decorator" | "venue_staff" | "other_creative_pro";
  whatsapp_on: 0 | 1;
  phone: string | null;
  source: string | null;
  remote_id: string | null;
  deleted_at: string | null;
  created_at: string;
};

export type Campaign = {
  id: number;
  subject: string;
  total: number;
  sent: number;
  failed: number;
  created_at: string;
};

export type MailLog = {
  id: number;
  campaign_id: number | null;
  email: string;
  subject: string | null;
  status: "sent" | "failed";
  error: string | null;
  created_at: string;
};

const insertSub = db.prepare(`
  INSERT INTO subscribers (email, name, role, whatsapp_on, phone, source)
  VALUES (@email, @name, @role, @whatsapp_on, @phone, @source)
  ON CONFLICT(email) DO NOTHING
`);

export function addSubscriber(input: {
  email: string;
  name?: string;
  role?: string;
  whatsappOn?: boolean;
  phone?: string;
  source?: string;
}): { created: boolean } {
  const email = input.email.trim().toLowerCase();
  const validRoles = ["event_planner", "decorator", "venue_staff", "other_creative_pro"];
  const role = validRoles.includes(input.role || "") ? input.role! : "event_planner";
  const info = insertSub.run({
    email,
    name: input.name?.trim() ? input.name.trim() : null,
    role,
    whatsapp_on: input.whatsappOn ? 1 : 0,
    phone: input.whatsappOn && input.phone?.trim() ? input.phone.trim() : null,
    source: input.source || null,
  });
  return { created: info.changes > 0 };
}

const insertRemote = db.prepare(`
  INSERT INTO subscribers (remote_id, email, name, role, whatsapp_on, phone, source, created_at)
  VALUES (@remoteId, @email, @name, 'event_planner', 0, NULL, 'backend', COALESCE(@createdAt, datetime('now')))
`);

export function upsertSubscriberFromRemote(input: {
  remoteId?: string;
  email: string;
  name?: string;
  createdAt?: string;
}): { created: boolean; matchedByEmail: boolean } {
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() ? input.name.trim() : null;

  let createdAt: string | null = null;
  if (input.createdAt) {
    const d = new Date(input.createdAt);
    if (!isNaN(d.getTime())) {
      createdAt = d.toISOString().slice(0, 19).replace("T", " ");
    }
  }

  if (input.remoteId) {
    const byRemote = db
      .prepare(`SELECT id, deleted_at FROM subscribers WHERE remote_id = ?`)
      .get(input.remoteId) as { id: number; deleted_at: string | null } | undefined;
    if (byRemote) {
      if (byRemote.deleted_at) {
        return { created: false, matchedByEmail: false };
      }
      db.prepare(
        `UPDATE subscribers SET email = @email, name = @name, source = 'backend' WHERE id = @id`
      ).run({ id: byRemote.id, email, name });
      return { created: false, matchedByEmail: false };
    }
  }

  const byEmail = db
    .prepare(`SELECT id, deleted_at FROM subscribers WHERE email = ?`)
    .get(email) as { id: number; deleted_at: string | null } | undefined;
  if (byEmail) {
    if (byEmail.deleted_at) {
      return { created: false, matchedByEmail: true };
    }
    db.prepare(
      `UPDATE subscribers SET name = @name, remote_id = @remoteId, source = 'backend' WHERE id = @id`
    ).run({ id: byEmail.id, name, remoteId: input.remoteId || null });
    return { created: false, matchedByEmail: true };
  }

  const info = insertRemote.run({
    remoteId: input.remoteId || null,
    email,
    name,
    createdAt,
  });
  return { created: info.changes > 0, matchedByEmail: false };
}

export function listSubscribers(filters?: {
  q?: string;
  role?: string;
  limit?: number;
  offset?: number;
}): { rows: Subscriber[]; total: number } {
  const where: string[] = [];
  const params: Record<string, string | number> = {};

  if (filters?.q) {
    where.push("(email LIKE @q OR name LIKE @q OR phone LIKE @q)");
    params.q = `%${filters.q}%`;
  }
  if (filters?.role === "planner" || filters?.role === "venue") {
    where.push("role = @role");
    params.role = filters.role;
  }
  where.push("deleted_at IS NULL");

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const limit = filters?.limit ?? 200;
  const offset = filters?.offset ?? 0;

  const total = (
    db.prepare(`SELECT COUNT(*) AS c FROM subscribers ${whereSql}`).get(params) as {
      c: number;
    }
  ).c;

  const rows = db
    .prepare(
      `SELECT * FROM subscribers ${whereSql}
       ORDER BY created_at DESC, id DESC
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit, offset }) as Subscriber[];

  return { rows, total };
}

const getSub = db.prepare(`SELECT * FROM subscribers WHERE id = ?`);
export function getSubscriber(id: number): Subscriber | undefined {
  return getSub.get(id) as Subscriber | undefined;
}

export function updateSubscriber(
  id: number,
  patch: { role?: string; whatsappOn?: boolean; phone?: string | null }
): boolean {
  const sub = getSubscriber(id);
  if (!sub) return false;
  const validRoles = ["event_planner", "decorator", "venue_staff", "other_creative_pro"];
  const role = validRoles.includes(patch.role || "") ? patch.role! : sub.role;
  db.prepare(
    `UPDATE subscribers SET
       role = @role,
       whatsapp_on = @whatsapp_on,
       phone = @phone
     WHERE id = @id`
  ).run({
    id,
    role,
    whatsapp_on: patch.whatsappOn ? 1 : sub.whatsapp_on,
    phone: patch.phone !== undefined ? patch.phone : sub.phone,
  });
  return true;
}

export function deleteSubscriber(id: number): boolean {
  return (
    db
      .prepare(`UPDATE subscribers SET deleted_at = datetime('now') WHERE id = ? AND deleted_at IS NULL`)
      .run(id).changes > 0
  );
}

export function getStats() {
  const total = (
    db.prepare(`SELECT COUNT(*) AS c FROM subscribers WHERE deleted_at IS NULL`).get() as { c: number }
  ).c;
  const eventPlanners = (
    db.prepare(`SELECT COUNT(*) AS c FROM subscribers WHERE role = 'event_planner' AND deleted_at IS NULL`).get() as { c: number }
  ).c;
  const decorators = (
    db.prepare(`SELECT COUNT(*) AS c FROM subscribers WHERE role = 'decorator' AND deleted_at IS NULL`).get() as { c: number }
  ).c;
  const venueStaff = (
    db.prepare(`SELECT COUNT(*) AS c FROM subscribers WHERE role = 'venue_staff' AND deleted_at IS NULL`).get() as { c: number }
  ).c;
  const otherCreativePros = (
    db.prepare(`SELECT COUNT(*) AS c FROM subscribers WHERE role = 'other_creative_pro' AND deleted_at IS NULL`).get() as { c: number }
  ).c;
  const whatsapp = (
    db.prepare(`SELECT COUNT(*) AS c FROM subscribers WHERE whatsapp_on = 1 AND deleted_at IS NULL`).get() as { c: number }
  ).c;
  const sent = (
    db.prepare(`SELECT COUNT(*) AS c FROM mail_logs WHERE status = 'sent'`).get() as { c: number }
  ).c;
  const failed = (
    db.prepare(`SELECT COUNT(*) AS c FROM mail_logs WHERE status = 'failed'`).get() as { c: number }
  ).c;
  const recent = db
    .prepare(`SELECT * FROM subscribers WHERE deleted_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 6`)
    .all() as Subscriber[];
  return { total, eventPlanners, decorators, venueStaff, otherCreativePros, whatsapp, sent, failed, recent };
}

export function listCampaigns(limit = 50): Campaign[] {
  return db
    .prepare(`SELECT * FROM campaigns ORDER BY created_at DESC, id DESC LIMIT ?`)
    .all(limit) as Campaign[];
}

const insertCampaign = db.prepare(`
  INSERT INTO campaigns (subject, total, sent, failed)
  VALUES (@subject, @total, @sent, @failed)
`);

const insertLog = db.prepare(`
  INSERT INTO mail_logs (campaign_id, email, subject, status, error)
  VALUES (@campaign_id, @email, @subject, @status, @error)
`);

export function recordCampaign(input: {
  subject: string;
  total: number;
  sent: number;
  failed: number;
}): number {
  const info = insertCampaign.run({
    subject: input.subject,
    total: input.total,
    sent: input.sent,
    failed: input.failed,
  });
  return Number(info.lastInsertRowid);
}

export function updateCampaignCounts(
  id: number,
  sent: number,
  failed: number
): void {
  db.prepare(
    `UPDATE campaigns SET sent = @sent, failed = @failed WHERE id = @id`
  ).run({ id, sent, failed });
}

export function recordMailLog(input: {
  campaignId: number;
  email: string;
  subject: string;
  status: "sent" | "failed";
  error?: string | null;
}) {
  insertLog.run({
    campaign_id: input.campaignId,
    email: input.email,
    subject: input.subject,
    status: input.status,
    error: input.error || null,
  });
}

export function listMailLogs(limit = 100): MailLog[] {
  return db
    .prepare(
      `SELECT * FROM mail_logs ORDER BY created_at DESC, id DESC LIMIT ?`
    )
    .all(limit) as MailLog[];
}

/* ---- sessions ---- */
export function createSession(
  tokenHash: string,
  ttlMs: number,
  backendToken?: string
): void {
  const expires = new Date(Date.now() + ttlMs).toISOString();
  db.prepare(
    `INSERT INTO admin_sessions (token_hash, expires_at, backend_token) VALUES (?, ?, ?)`
  ).run(tokenHash, expires, backendToken || null);
}

export function getSession(tokenHash: string): boolean {
  return getSessionBackendToken(tokenHash) !== null;
}

export function getSessionBackendToken(tokenHash: string): string | null {
  const row = db
    .prepare(`SELECT expires_at, backend_token FROM admin_sessions WHERE token_hash = ?`)
    .get(tokenHash) as { expires_at: string; backend_token: string | null } | undefined;
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    deleteSession(tokenHash);
    return null;
  }
  return row.backend_token || null;
}

export function deleteSession(tokenHash: string): void {
  db.prepare(`DELETE FROM admin_sessions WHERE token_hash = ?`).run(tokenHash);
}

export function deleteExpiredSessions(): void {
  db.prepare(`DELETE FROM admin_sessions WHERE expires_at < ?`).run(
    new Date().toISOString()
  );
}

export default db;