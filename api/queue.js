const { fresh, apply, PUBLIC } = require("./_engine");
const { load, save, withLock, hasDb } = require("./_store");

const PIN = process.env.HOST_PIN || "1234";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      if (req.query && req.query.check !== undefined) {
        return res.status(200).json({ ok: String(req.headers["x-host-pin"] || "") === PIN });
      }
      const S = (await load()) || fresh();
      return res.status(200).json({ ...S, persistent: hasDb() });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const a = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (!PUBLIC.has(a.type) && String(req.headers["x-host-pin"] || "") !== PIN) {
      return res.status(401).json({ error: "Wrong host PIN." });
    }
    const out = await withLock(async () => {
      const S = (await load()) || fresh();
      const { state, result } = apply(S, a);
      await save(state);
      return { state, result };
    });
    return res.status(200).json({ ...out.state, persistent: hasDb(), result: out.result });
  } catch (e) {
    return res.status(400).json({ error: e.message || "Something went wrong." });
  }
};
