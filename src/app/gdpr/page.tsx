import type { Metadata } from "next";
import { LegalPage, Section, P, UL, LI, InfoBox, SubHeading, company } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů – Iveta Clarke",
};

export default function GdprPage() {
  return (
    <LegalPage
      title="Ochrana osobních údajů"
      subtitle="Zásady zpracování osobních údajů dle GDPR · Platné od 1. 7. 2026"
    >
      <Section title="1. Správce osobních údajů">
        <InfoBox>
          <strong>Správce:</strong><br />
          {company.name}<br />
          {company.address}<br />
          IČO: {company.ico} · DIČ: {company.dic}<br />
          Tel.: <a href={`tel:+420724001030`} style={{ color: "#C9A84C" }}>{company.phone}</a><br />
          E-mail: <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>
        </InfoBox>
        <P>
          Správce zpracovává osobní údaje v souladu s Nařízením Evropského parlamentu a Rady (EU)
          2016/679 (GDPR) a zákonem č. 110/2019 Sb., o zpracování osobních údajů.
        </P>
      </Section>

      <Section title="2. Jaké osobní údaje zpracováváme">
        <SubHeading>Údaje poskytnuté při objednávce:</SubHeading>
        <UL>
          <LI>Jméno a příjmení</LI>
          <LI>E-mailová adresa</LI>
          <LI>Telefonní číslo</LI>
          <LI>Fakturační adresa (ulice, město, PSČ)</LI>
          <LI>Název firmy a IČO (nepovinné, pouze pro B2B fakturaci)</LI>
        </UL>
        <SubHeading>Údaje vznikající při používání webu:</SubHeading>
        <UL>
          <LI>IP adresa a typ prohlížeče (anonymizovaně prostřednictvím Google Analytics)</LI>
          <LI>Cookies – viz sekce 7</LI>
        </UL>
        <SubHeading>Údaje sdílené v rámci koučovacího vztahu:</SubHeading>
        <UL>
          <LI>Informace sdělené klientem v průběhu koučovacích nebo supervizních sezení podléhají
          mlčenlivosti a jsou zpracovávány výhradně pro plnění smlouvy. Nejsou sdíleny s třetími
          stranami.</LI>
        </UL>
      </Section>

      <Section title="3. Účel a právní základ zpracování">
        <UL>
          <LI>
            <strong>Plnění smlouvy</strong> – zpracování objednávky, zajištění sezení, fakturace
            (čl. 6 odst. 1 písm. b) GDPR)
          </LI>
          <LI>
            <strong>Zákonná povinnost</strong> – vedení účetnictví a archivace daňových dokladů
            (čl. 6 odst. 1 písm. c) GDPR)
          </LI>
          <LI>
            <strong>Oprávněný zájem</strong> – zasílání informací o nových službách stávajícím
            klientům (čl. 6 odst. 1 písm. f) GDPR); klient má právo kdykoli vznést námitku
          </LI>
          <LI>
            <strong>Souhlas</strong> – zasílání newsletteru nebo marketingových sdělení novým
            zájemcům (čl. 6 odst. 1 písm. a) GDPR); souhlas je kdykoli odvolatelný
          </LI>
        </UL>
      </Section>

      <Section title="4. Doba uchovávání">
        <UL>
          <LI>Smluvní údaje: po dobu trvání smluvního vztahu + 3 roky (zákonná promlčecí lhůta)</LI>
          <LI>Účetní doklady: 5 let dle zákona č. 563/1991 Sb., o účetnictví</LI>
          <LI>Daňové doklady: 10 let dle § 35 zákona č. 235/2004 Sb., o DPH</LI>
          <LI>Marketingová komunikace: do odvolání souhlasu, nejdéle 3 roky od posledního kontaktu</LI>
        </UL>
      </Section>

      <Section title="5. Příjemci osobních údajů">
        <P>Osobní údaje mohou být sdíleny s těmito kategoriemi příjemců:</P>
        <UL>
          <LI><strong>Platební brána ComGate Payments, a.s.</strong> – zpracování plateb</LI>
          <LI><strong>Účetní a daňový poradce</strong> – vedení účetnictví (mlčenlivost dle smlouvy)</LI>
          <LI><strong>Google LLC</strong> – Google Analytics (anonymizovaná data o návštěvnosti)</LI>
          <LI><strong>Spotify AB</strong> – embedded přehrávač podcastů (technické cookies)</LI>
        </UL>
        <P>
          Osobní údaje nejsou předávány do třetích zemí mimo EHP s výjimkou Google Analytics,
          kde je zajištěna přiměřená ochrana prostřednictvím standardních smluvních doložek EU.
        </P>
      </Section>

      <Section title="6. Vaše práva">
        <P>V souladu s GDPR máte následující práva:</P>
        <UL>
          <LI><strong>Právo na přístup</strong> – získat potvrzení, zda zpracováváme vaše údaje, a jejich kopii</LI>
          <LI><strong>Právo na opravu</strong> – požádat o opravu nepřesných nebo neúplných údajů</LI>
          <LI><strong>Právo na výmaz</strong> – „právo být zapomenut", pokud odpadl účel zpracování</LI>
          <LI><strong>Právo na omezení zpracování</strong> – v zákonem stanovených případech</LI>
          <LI><strong>Právo na přenositelnost</strong> – obdržet údaje ve strojově čitelném formátu</LI>
          <LI><strong>Právo vznést námitku</strong> – zejm. proti zpracování na základě oprávněného zájmu nebo pro přímý marketing</LI>
          <LI><strong>Právo odvolat souhlas</strong> – kdykoli, bez vlivu na zákonnost dřívějšího zpracování</LI>
        </UL>
        <P>
          Žádost uplatněte e-mailem na{" "}
          <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>.
          Odpovíme do 30 dnů.
        </P>
        <P>
          Pokud se domníváte, že zpracování porušuje GDPR, máte právo podat stížnost u{" "}
          <strong>Úřadu pro ochranu osobních údajů (ÚOOÚ)</strong>:{" "}
          <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" style={{ color: "#C9A84C" }}>www.uoou.cz</a>.
        </P>
      </Section>

      <Section title="7. Cookies">
        <P>
          Web ivetaclarke.com používá cookies nezbytné pro technický provoz stránky. Dále mohou být
          aktivovány analytické cookies (Google Analytics) a cookies třetích stran (Spotify,
          YouTube) při načtení embedded obsahu.
        </P>
        <UL>
          <LI><strong>Nezbytné cookies</strong> – zajišťují základní funkčnost webu; nelze je odmítnout</LI>
          <LI><strong>Analytické cookies</strong> – anonymizované statistiky návštěvnosti (Google Analytics 4); lze odmítnout</LI>
          <LI><strong>Cookies třetích stran</strong> – načítají se pouze při přehrání embedded obsahu (Spotify, YouTube)</LI>
        </UL>
      </Section>

      <Section title="8. Zabezpečení">
        <P>
          Osobní údaje jsou chráněny technickými a organizačními opatřeními: šifrovaná komunikace
          (HTTPS), přístup pouze oprávněných osob, pravidelné zálohování. Web je provozován na
          platformě Vercel s certifikátem TLS.
        </P>
      </Section>

      <Section title="9. Změny zásad">
        <P>
          Tyto zásady mohou být průběžně aktualizovány. Datum poslední aktualizace je uvedeno
          v záhlaví stránky. Při podstatných změnách budeme klienty informovat e-mailem.
        </P>
      </Section>
    </LegalPage>
  );
}
