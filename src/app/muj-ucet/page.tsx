"use client";
import React, { useState, useEffect } from "react";
import { supabase, type Profile, type Order } from "@/lib/supabase";

const C = {
  cream: "#FAF8F4", warm: "#F0EBE3", sand: "#E8DDD0",
  gold: "#C9A84C", goldLight: "#E8C96A", dark: "#2C2C3E",
  darker: "#1E1E2E", text: "#3A3530", muted: "#8A8070", white: "#FFFFFF",
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:          { label: "Čeká na platbu", color: "#8A8070" },
  PAID:             { label: "Zaplaceno",       color: "#4CAF7C" },
  CANCEL_REQUESTED: { label: "Žádost o storno", color: "#E8943A" },
  CANCELLED:        { label: "Stornováno",      color: "#C85050" },
};

export default function MujUcet() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelMsg, setCancelMsg] = useState<{ id: string; ok: boolean; text: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { window.location.href = "/"; return; }
      const u = { id: session.user.id, email: session.user.email };
      setUser(u);
      loadData(u.id);
    });
  }, []);

  const loadData = async (userId: string) => {
    const [{ data: p }, { data: o }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    if (p) setProfile(p as Profile);
    if (o) setOrders(o as Order[]);
    setLoading(false);
  };

  const canCancel = (order: Order) => {
    if (order.status !== "PAID") return false;
    return (Date.now() - new Date(order.paid_at!).getTime()) < 14 * 86400000;
  };

  const handleCancel = async (orderId: string) => {
    if (!user) return;
    setCancellingId(orderId);
    const res = await fetch("/api/orders/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, userId: user.id }),
    });
    const data = await res.json();
    setCancellingId(null);
    if (data.ok) {
      setCancelMsg({ id: orderId, ok: true, text: "Žádost o storno byla odeslána. Zpracujeme ji v co nejkratším termínu." });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "CANCEL_REQUESTED" } : o));
    } else {
      setCancelMsg({ id: orderId, ok: false, text: data.error ?? "Nastala chyba." });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update(editForm).eq("id", user.id);
    setProfile(prev => ({ ...prev!, ...editForm }));
    setEditMode(false);
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px", borderRadius: 9,
    border: `1px solid ${C.sand}`, background: C.cream,
    fontSize: 14, fontFamily: "Georgia, serif", color: C.text,
    outline: "none", boxSizing: "border-box",
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream }}>
      <div style={{ fontSize: 14, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>Načítání…</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, serif", background: C.cream, minHeight: "100vh", color: C.text }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${C.sand}`, padding: "0 40px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: C.cream, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 3, height: 22, background: C.gold, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 16, color: C.dark, letterSpacing: "0.03em" }}>Iveta Clarke</div>
            <div style={{ fontSize: 8, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif" }}>INSPIRING CONVERSATION</div>
          </div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>{user?.email}</span>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
            style={{ background: "none", border: `1px solid ${C.sand}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", color: C.muted, cursor: "pointer" }}>
            Odhlásit
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 8 }}>MŮJ ÚČET</div>
          <h1 style={{ fontSize: 32, fontWeight: "normal", margin: "0 0 4px" }}>
            {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : "Vítejte"}
          </h1>
          <div style={{ width: 40, height: 2, background: C.gold, borderRadius: 1, marginTop: 12 }} />
        </div>

        {/* Orders */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: "normal", margin: "0 0 20px", color: C.dark }}>Moje objednávky</h2>
          {orders.length === 0 ? (
            <div style={{ padding: "32px 24px", background: C.warm, borderRadius: 16, border: `1px solid ${C.sand}`, textAlign: "center" }}>
              <p style={{ fontSize: 15, color: C.muted, margin: 0 }}>Zatím žádné objednávky.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orders.map(order => {
                const st = STATUS_LABEL[order.status] ?? { label: order.status, color: C.muted };
                const cancellable = canCancel(order);
                const msg = cancelMsg?.id === order.id ? cancelMsg : null;
                return (
                  <div key={order.id} style={{ background: C.white, borderRadius: 16, padding: "24px 28px", border: `1px solid ${C.sand}`, boxShadow: "0 2px 16px rgba(44,44,62,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 16, color: C.dark, marginBottom: 4 }}>{order.package_title}</div>
                        <div style={{ fontSize: 12, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>
                          {new Date(order.created_at).toLocaleDateString("cs-CZ")}
                          {order.paid_at && ` · Zaplaceno ${new Date(order.paid_at).toLocaleDateString("cs-CZ")}`}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, color: C.dark, marginBottom: 4 }}>{order.price_display}</div>
                        <div style={{ display: "inline-block", fontSize: 11, fontFamily: "Trebuchet MS, sans-serif", padding: "3px 10px", borderRadius: 20, background: `${st.color}18`, color: st.color, fontWeight: "bold" }}>
                          {st.label}
                        </div>
                      </div>
                    </div>

                    {msg && (
                      <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 9, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", background: msg.ok ? "rgba(76,175,124,0.08)" : "rgba(200,80,80,0.08)", color: msg.ok ? "#4CAF7C" : "#C85050", border: `1px solid ${msg.ok ? "rgba(76,175,124,0.3)" : "rgba(200,80,80,0.3)"}` }}>
                        {msg.text}
                      </div>
                    )}

                    {cancellable && !msg && (
                      <div style={{ marginTop: 16 }}>
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancellingId === order.id}
                          style={{ padding: "9px 20px", borderRadius: 20, border: "1px solid #C85050", background: "transparent", color: "#C85050", fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", cursor: "pointer", opacity: cancellingId === order.id ? 0.6 : 1 }}
                        >
                          {cancellingId === order.id ? "Odesílám…" : "Požádat o storno"}
                        </button>
                        <span style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginLeft: 12 }}>
                          Možné do {new Date(new Date(order.paid_at!).getTime() + 14 * 86400000).toLocaleDateString("cs-CZ")}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Profile */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: "normal", margin: 0, color: C.dark }}>Osobní údaje</h2>
            {!editMode && (
              <button onClick={() => { setEditForm({ ...profile }); setEditMode(true); }}
                style={{ background: "none", border: `1px solid ${C.sand}`, borderRadius: 20, padding: "6px 16px", fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", color: C.muted, cursor: "pointer" }}>
                Upravit
              </button>
            )}
          </div>

          {editMode ? (
            <div style={{ background: C.white, borderRadius: 16, padding: "28px", border: `1px solid ${C.sand}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>JMÉNO</label>
                  <input value={editForm.first_name ?? ""} onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>PŘÍJMENÍ</label>
                  <input value={editForm.last_name ?? ""} onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>TELEFON</label>
                <input value={editForm.phone ?? ""} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>ULICE</label>
                <input value={editForm.street ?? ""} onChange={e => setEditForm(f => ({ ...f, street: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>MĚSTO</label>
                  <input value={editForm.city ?? ""} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>PSČ</label>
                  <input value={editForm.zip ?? ""} onChange={e => setEditForm(f => ({ ...f, zip: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={handleSaveProfile} disabled={saving}
                  style={{ padding: "11px 24px", borderRadius: 20, background: C.gold, border: "none", color: C.dark, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", cursor: "pointer" }}>
                  {saving ? "Ukládám…" : "Uložit"}
                </button>
                <button onClick={() => setEditMode(false)}
                  style={{ padding: "11px 24px", borderRadius: 20, background: "none", border: `1px solid ${C.sand}`, color: C.muted, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", cursor: "pointer" }}>
                  Zrušit
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: C.white, borderRadius: 16, padding: "28px", border: `1px solid ${C.sand}` }}>
              {profile ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    ["Jméno", `${profile.first_name} ${profile.last_name}`],
                    ["Telefon", profile.phone],
                    ["Ulice", profile.street],
                    ["Město / PSČ", `${profile.city}, ${profile.zip}`],
                    ...(profile.company ? [["Firma", profile.company]] : []),
                    ...(profile.ico ? [["IČO", profile.ico]] : []),
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", marginBottom: 4 }}>{label?.toUpperCase()}</div>
                      <div style={{ fontSize: 15, color: C.text }}>{value || "—"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: C.muted, margin: 0 }}>Profil není vyplněn.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
