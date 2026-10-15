// POST /api/contact  ->  emails the inquiry to the Flying Buttress team via Azure Communication Services Email.
// Required app settings: ACS_CONNECTION_STRING, CONTACT_FROM, CONTACT_TO (comma-separated for multiple recipients).
const { EmailClient } = require("@azure/communication-email");

const LIMITS = { name: 150, email: 200, company: 150, firmtype: 60, topic: 60, message: 3000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v, max) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";
const oneLine = (s) => s.replace(/[\r\n]+/g, " ");
const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async function (context, req) {
  const reply = (status, body) => {
    context.res = {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body,
    };
  };

  const b = req.body && typeof req.body === "object" ? req.body : null;
  if (!b) return reply(400, { ok: false, error: "Invalid request." });

  // Honeypot: real visitors never see or fill this field. Pretend success so bots get no signal.
  if (clean(b.website, 100)) return reply(200, { ok: true });

  const f = {};
  for (const k of Object.keys(LIMITS)) f[k] = clean(b[k], LIMITS[k]);

  if (!f.name || !EMAIL_RE.test(f.email) || f.message.length < 10) {
    return reply(400, { ok: false, error: "Please provide your name, a valid email and a message." });
  }

  const { ACS_CONNECTION_STRING, CONTACT_FROM, CONTACT_TO } = process.env;
  if (!ACS_CONNECTION_STRING || !CONTACT_FROM || !CONTACT_TO) {
    context.log.error("Contact function is missing ACS_CONNECTION_STRING, CONTACT_FROM or CONTACT_TO.");
    return reply(500, { ok: false, error: "Message service is not configured." });
  }

  const rows = [
    ["Name", f.name],
    ["Email", f.email],
    ["Firm", f.company || "-"],
    ["Firm type", f.firmtype || "-"],
    ["Topic", f.topic || "-"],
  ];
  const plainText = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessage:\n${f.message}\n`;
  const html =
    `<table cellpadding="4" style="font-family:sans-serif;font-size:14px">` +
    rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join("") +
    `</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(f.message)}</p>`;

  try {
    const client = new EmailClient(ACS_CONNECTION_STRING);
    await client.beginSend({
      senderAddress: CONTACT_FROM,
      content: {
        subject: `Website inquiry: ${oneLine(f.name)}${f.company ? ` (${oneLine(f.company)})` : ""}`,
        plainText,
        html,
      },
      recipients: { to: CONTACT_TO.split(",").map((a) => ({ address: a.trim() })).filter((a) => a.address) },
      replyTo: [{ address: f.email, displayName: oneLine(f.name) }],
    });
    return reply(200, { ok: true });
  } catch (err) {
    context.log.error("ACS send failed", err && err.message);
    return reply(502, { ok: false, error: "Could not send message." });
  }
};
