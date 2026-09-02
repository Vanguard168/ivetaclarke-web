"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const C = {
  cream: "#FAF8F4", warm: "#F0EBE3", sand: "#E8DDD0",
  gold: "#C9A84C", goldLight: "#E8C96A", dark: "#2C2C3E",
  darker: "#1E1E2E", text: "#3A3530", muted: "#8A8070", white: "#FFFFFF",
};

const PRODUCTS = [
  { id: "1x",       label: "Jednorázová konzultace",           price: "5 990 Kč" },
  { id: "1x-personal", label: "Konzultace osobní",             price: "8 990 Kč" },
  { id: "3m",       label: "Krátkodobá spolupráce (3 měsíce)", price: "24 990 Kč (−2 999 Kč po odečtení screeningu)" },
  { id: "6m",       label: "Střednědobá spolupráce (6 měsíců)",price: "44 990 Kč (−2 999 Kč po odečtení screeningu)" },
  { id: "12m",      label: "Roční spolupráce (12 měsíců)",     price: "74 990 Kč (−2 999 Kč po odečtení screeningu)" },
  { id: "sup-1x",   label: "Supervize – Ochutnávka",           price: "4 890 Kč" },
  { id: "sup-6x",   label: "Supervizní balíček (6 setkání)",   price: "35 990 Kč" },
  { id: "ws-base",  label: "Workshop – Základní program",      price: "43 590 Kč" },
  { id: "ws-b1",    label: "Workshop + Bonus 1",               price: "59 990 Kč" },
  { id: "ws-b2",    label: "Workshop + Bonus 2",               price: "50 990 Kč" },
  { id: "ws-full",  label: "Workshop – Plný program",          price: "66 990 Kč" },
  { id: "ws-base-eb", label: "Workshop Základní – Early bird", price: "37 050 Kč" },
  { id: "ws-b1-eb", label: "Workshop + Bonus 1 – Early bird",  price: "50 990 Kč" },
  { id: "ws-b2-eb", label: "Workshop + Bonus 2 – Early bird",  price: "43 340 Kč" },
  { id: "ws-full-eb", label: "Workshop Plný – Early bird",     price: "56 940 Kč" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:         { label: "Čeká na platbu screeningu", color: "#8A8070" },
  screening_paid:  { label: "Screening zaplacen",         color: "#4CAF7C" },
  screening_done:  { label: "Screening proběhl",          color: "#4CAF7C" },
  payment_sent:    { label: "Odkaz odeslán",              color: "#C9A84C" },
  completed:       { label: "Dokončeno",                  color: "#4CAF7C" },
  cancelled:       { label: "Zrušeno",                   color: "#C85050" },
};

type ScreeningRequest = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  phone?: string;
  screening_type: "paid" | "free";
  why_interested?: string;
  previous_experience?: string;
  goals?: string;
  preferred_product?: string;
  preferred_product_label?: string;
  workshop_motivation?: string;
  workshop_background?: string;
  workshop_experience?: string;
  preferred_workshop_variant?: string;
  preferred_workshop_variant_label?: string;
  status: string;
  screening_paid_at?: string;
  selected_package_id?: string;
  selected_package_title?: string;
  admin_notes?: string;
  product_payment_sent_at?: string;
  created_at: string;
};

export default function AdminPage() {
  const [jwt, setJwt] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [requests, setRequests] = useState<ScreeningRequest[]>([]);
  const [selected, setSelected] = useState<ScreeningRequest | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setIsAdmin(false); setLoading(false); return; }
      const token = session.access_token;
      setJwt(token);
      const res = await fetch("/api/admin/screening", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setIsAdmin(false); setLoading(false); return; }
      const data = await res.json();
      setIsAdmin(true);
      setRequests(data.requests ?? []);
      setLoading(false);
    });
  }, []);

  const reload = useCallback(async () => {
    if (!jwt) return;
    const res = await fetch("/api/admin/screening", { headers: { Authorization: `Bearer ${jwt}` } });
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests ?? []);
    }
  }, [jwt]);

  const openDetail = (r: ScreeningRequest) => {
    setSelected(r);
    setAdminNotes(r.admin_notes ?? "");
    setSelectedPkg("");
    setSendMsg(null);
  };

  const handleSendPayment = async () => {
    if (!selected || !selectedPkg || !jwt) return;
    setSending(true);
    setSendMsg(null);
    const res = await fetch("/api/admin/send-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ screeningRequestId: selected.id, packageId: selectedPkg }),
    });
    const data = await res.json();
    setSending(false);
    if (data.ok) {
      setSendMsg({ ok: true, text: "Platební odkaz byl odeslán zákazníkovi e-mailem." });
      await reload();
      setSelected(prev => prev ? { ...prev, status: "payment_sent" } : null);
    } else {
      setSendMsg({ ok: false, text: data.error ?? "Nastala chyba." });
    }
  };

  const handleMarkDone = async (status: string) => {
    if (!selected || !jwt) return;
    await fetch("/api/admin/screening", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id: selected.id, status }),
    });
    setSelected(prev => prev ? { ...prev, status } : null);
    await reload();
  };

  const handleSaveNotes = async () => {
    if (!selected || !jwt) return;
    setSavingNotes(true);
    await fetch("/api/admin/screening", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id: selected.id, admin_notes: adminNotes }),
    });
    setSavingNotes(false);
    setSelected(prev => prev ? { ...prev, admin_notes: adminNotes } : null);
    await reload();
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${C.sand}`, background: C.cream,
    fontSize: 13, fontFamily: "Georgia, serif", color: C.text,
    outline: "none", boxSizing: "border-box",
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream }}>
      <div style={{ fontSize: 14, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>Načítání…</div>
    </div>
  );

  if (isAdmin === false) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream, flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 18, color: C.dark }}>Přístup odepřen</div>
      <a href="/" style={{ fontSize: 13, color: C.gold, fontFamily: "Trebuchet MS, sans-serif" }}>← Zpět na web</a>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, serif", background: C.cream, minHeight: "100vh", color: C.text }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${C.sand}`, padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.cream, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", textDecoration: "none" }}>← Web</a>
          <div style={{ width: 1, height: 16, background: C.sand }} />
          <div style={{ fontSize: 14, color: C.dark, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.05em" }}>ADMIN — Screening žádosti</div>
        </div>
        <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif" }}>
          {requests.length} žádostí celkem
        </div>
      </nav>

      <div style={{ display: "flex", maxWidth: 1300, margin: "0 auto", minHeight: "calc(100vh - 54px)" }}>
        {/* Left: list */}
        <div style={{ width: selected ? 380 : "100%", flexShrink: 0, borderRight: selected ? `1px solid ${C.sand}` : "none", padding: "24px 20px" }}>
          {/* Filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { key: "all", label: "Vše" },
              { key: "pending", label: "Čeká" },
              { key: "screening_paid", label: "Zaplaceno" },
              { key: "screening_done", label: "Proběhl" },
              { key: "payment_sent", label: "Odkaz odeslán" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "5px 12px", borderRadius: 16, fontSize: 11,
                fontFamily: "Trebuchet MS, sans-serif",
                background: filter === f.key ? C.gold : "transparent",
                border: `1px solid ${filter === f.key ? C.gold : C.sand}`,
                color: filter === f.key ? C.darker : C.muted,
                cursor: "pointer",
              }}>{f.label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: C.muted, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif" }}>Žádné žádosti</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(r => {
                const st = STATUS_LABELS[r.status] ?? { label: r.status, color: C.muted };
                const isActive = selected?.id === r.id;
                return (
                  <div key={r.id} onClick={() => openDetail(r)} style={{
                    padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                    background: isActive ? C.warm : C.white,
                    border: `1px solid ${isActive ? C.sand : C.sand}`,
                    boxShadow: isActive ? "none" : "0 2px 8px rgba(44,44,62,0.04)",
                    transition: "all 0.15s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 14, color: C.dark, marginBottom: 2 }}>{r.user_name}</div>
                        <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>{r.user_email}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <div style={{ fontSize: 10, fontFamily: "Trebuchet MS, sans-serif", padding: "2px 8px", borderRadius: 10, background: `${st.color}18`, color: st.color, fontWeight: "bold", whiteSpace: "nowrap" }}>
                          {st.label}
                        </div>
                        <div style={{ fontSize: 10, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>
                          {r.screening_type === "free" ? "Výcvik (zdarma)" : "Placený screening"}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginTop: 6 }}>
                      {new Date(r.created_at).toLocaleDateString("cs-CZ")}
                      {r.preferred_product_label && ` · ${r.preferred_product_label}`}
                      {r.preferred_workshop_variant_label && ` · ${r.preferred_workshop_variant_label}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: detail */}
        {selected && (
          <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: "normal", margin: "0 0 4px" }}>{selected.user_name}</h2>
                <div style={{ fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>{selected.user_email} · {selected.phone ?? "—"}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: `1px solid ${C.sand}`, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", color: C.muted, cursor: "pointer" }}>Zavřít</button>
            </div>

            {/* Status */}
            {(() => {
              const st = STATUS_LABELS[selected.status] ?? { label: selected.status, color: C.muted };
              return (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", padding: "4px 12px", borderRadius: 12, background: `${st.color}18`, color: st.color, fontWeight: "bold" }}>{st.label}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>
                    {selected.screening_type === "free" ? "Výcvik — screening ZDARMA" : "Konzultace/koučink — screening 2 999 Kč"}
                  </div>
                </div>
              );
            })()}

            {/* Questionnaire */}
            <div style={{ background: C.white, borderRadius: 16, padding: "24px", border: `1px solid ${C.sand}`, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 16 }}>DOTAZNÍK</div>
              {selected.screening_type === "paid" ? (
                <>
                  <QA label="Zájem o produkt" value={selected.preferred_product_label} />
                  <QA label="Proč vás zajímá koučink?" value={selected.why_interested} />
                  <QA label="Zkušenosti s koučinkem/terapií" value={selected.previous_experience} />
                  <QA label="Co chce zákazník řešit" value={selected.goals} />
                </>
              ) : (
                <>
                  <QA label="Varianta výcviku" value={selected.preferred_workshop_variant_label} />
                  <QA label="Proč zájem o výcvik?" value={selected.workshop_motivation} />
                  <QA label="Zkušenosti s koučinkem" value={selected.workshop_background} />
                  <QA label="Délka praxe" value={selected.workshop_experience} />
                </>
              )}
            </div>

            {/* Send payment (only for non-free or if needed) */}
            {(selected.status === "screening_paid" || selected.status === "screening_done" || selected.status === "pending") && (
              <div style={{ background: C.white, borderRadius: 16, padding: "24px", border: `1px solid ${C.sand}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 16 }}>ODESLAT PLATEBNÍ ODKAZ</div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>VYBERTE PRODUKT</label>
                  <select value={selectedPkg} onChange={e => setSelectedPkg(e.target.value)} style={{ ...inputStyle, background: C.cream }}>
                    <option value="">— zvolte produkt —</option>
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.label} — {p.price}</option>
                    ))}
                  </select>
                </div>

                {selectedPkg && (
                  <div style={{ fontSize: 12, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginBottom: 16, padding: "8px 12px", background: C.cream, borderRadius: 8 }}>
                    {["3m", "6m", "12m"].includes(selectedPkg) && selected.screening_paid_at
                      ? "Poplatek za screening (2 999 Kč) bude automaticky odečten z ceny produktu."
                      : "Zákazník zaplatí plnou cenu produktu."}
                  </div>
                )}

                <button
                  onClick={handleSendPayment}
                  disabled={!selectedPkg || sending}
                  style={{
                    padding: "12px 24px", borderRadius: 24,
                    background: selectedPkg ? C.gold : C.sand,
                    border: "none", color: selectedPkg ? C.darker : C.muted,
                    fontSize: 13, fontFamily: "Trebuchet MS, sans-serif",
                    fontWeight: "bold", cursor: selectedPkg ? "pointer" : "not-allowed",
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? "Odesílám…" : "Odeslat platební odkaz zákazníkovi"}
                </button>

                {sendMsg && (
                  <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 9, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", background: sendMsg.ok ? "rgba(76,175,124,0.08)" : "rgba(200,80,80,0.08)", color: sendMsg.ok ? "#4CAF7C" : "#C85050", border: `1px solid ${sendMsg.ok ? "rgba(76,175,124,0.3)" : "rgba(200,80,80,0.3)"}` }}>
                    {sendMsg.text}
                  </div>
                )}
              </div>
            )}

            {/* Status actions */}
            <div style={{ background: C.white, borderRadius: 16, padding: "24px", border: `1px solid ${C.sand}`, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 16 }}>SPRÁVA STAVU</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selected.status === "pending" && selected.screening_type === "free" && (
                  <ActionBtn onClick={() => handleMarkDone("screening_done")} label="Označit: screening proběhl" />
                )}
                {selected.status === "screening_paid" && (
                  <ActionBtn onClick={() => handleMarkDone("screening_done")} label="Označit: screening proběhl" />
                )}
                {selected.status !== "completed" && selected.status !== "cancelled" && (
                  <ActionBtn onClick={() => handleMarkDone("completed")} label="Označit: dokončeno" color="#4CAF7C" />
                )}
                {selected.status !== "cancelled" && (
                  <ActionBtn onClick={() => handleMarkDone("cancelled")} label="Zrušit" color="#C85050" />
                )}
              </div>
            </div>

            {/* Admin notes */}
            <div style={{ background: C.white, borderRadius: 16, padding: "24px", border: `1px solid ${C.sand}` }}>
              <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 12 }}>POZNÁMKY (INTERNÍ)</div>
              <textarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Poznámky k zákazníkovi, domluvené termíny apod."
              />
              <button onClick={handleSaveNotes} disabled={savingNotes} style={{ marginTop: 10, padding: "8px 20px", borderRadius: 20, background: C.gold, border: "none", color: C.darker, fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", cursor: "pointer", opacity: savingNotes ? 0.7 : 1 }}>
                {savingNotes ? "Ukládám…" : "Uložit poznámky"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QA({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "#8A8070", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.08em", marginBottom: 3 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 14, color: "#3A3530", lineHeight: 1.6 }}>{value || "—"}</div>
    </div>
  );
}

function ActionBtn({ onClick, label, color = "#8A8070" }: { onClick: () => void; label: string; color?: string }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 20, border: `1px solid ${color}`,
      background: "transparent", color, fontSize: 12,
      fontFamily: "Trebuchet MS, sans-serif", cursor: "pointer",
    }}>{label}</button>
  );
}
