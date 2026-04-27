# Iveta Clarke – Web

Custom Next.js web pro **ivetaclarke.com**

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **React** inline styles (bez externích CSS knihoven)
- **Vercel** deployment

## Spuštění lokálně

```bash
npm install
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000)

## Nasazení na Vercel

1. Nahraj na GitHub
2. Jdi na [vercel.com](https://vercel.com) → New Project → vyber repozitář
3. Framework: **Next.js** (detekuje automaticky)
4. Deploy → hotovo

## Připojení domény ivetaclarke.com

V Vercel → Settings → Domains → přidej `ivetaclarke.com`

Nastav u registrátora domény:
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

## Struktura

```
src/
  app/
    layout.tsx    ← SEO metadata, HTML shell
    page.tsx      ← Celý web (jedna stránka)
public/
  images/         ← Sem vložte fotky Ivety
```

## TODO – před spuštěním

- [ ] Nahradit placeholder fotky reálnými fotografiemi
- [ ] Doplnit skutečný odkaz na rezervační kalendář
- [ ] Napojit kontaktní formulář (Resend / Formspree)
- [ ] Finální fonty a barvy po konzultaci s Andreou Grigarovou
- [ ] Přidat úvodní video (pampeliška)
- [ ] Napojit platební bránu (Stripe / GoPay)
