import type { Metadata } from "next";
import { LegalPage, Section, P, UL, LI, InfoBox, SubHeading, company } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Platební a dodací podmínky – Iveta Clarke",
};

export default function PlatebniPodminkyPage() {
  return (
    <LegalPage
      title="Platební a dodací podmínky"
      subtitle="Platné od 1. 7. 2026"
    >
      <Section title="1. Poskytovatel">
        <InfoBox>
          {company.name}<br />
          {company.address}<br />
          IČO: {company.ico} · DIČ: {company.dic}<br />
          Tel.: <a href={`tel:+420724001030`} style={{ color: "#C9A84C" }}>{company.phone}</a><br />
          E-mail: <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>
        </InfoBox>
      </Section>

      <Section title="2. Způsoby platby">
        <P>
          Všechny platby probíhají bezhotovostně prostřednictvím certifikované platební brány{" "}
          <strong>ComGate Payments, a.s.</strong> Akceptujeme následující platební metody:
        </P>
        <UL>
          <LI><strong>Platební karta</strong> – Visa, Mastercard (okamžitá platba)</LI>
          <LI><strong>Apple Pay</strong> – pro uživatele zařízení Apple</LI>
          <LI><strong>Google Pay</strong> – pro uživatele zařízení Android / Chrome</LI>
        </UL>
        <P>
          Hotovostní platby ani bankovní převody nejsou v současné době podporovány.
          Veškerá platební data jsou šifrována a zpracovávána výhradně platební bránou ComGate –
          poskytovatel k číslům karet ani platebním údajům nemá přístup.
        </P>
      </Section>

      <Section title="3. Ceny a DPH">
        <P>
          Všechny ceny jsou uváděny v českých korunách (Kč) a zahrnují DPH ve výši 21 %.
          Cena bez DPH je vždy uvedena v detailu nabídky. Poskytovatel je plátcem DPH.
        </P>
        <P>
          Poskytovatel si vyhrazuje právo ceny upravovat. Na objednávky již zaplacené se změna
          ceny nevztahuje.
        </P>
      </Section>

      <Section title="4. Fakturace">
        <P>
          Po úspěšném provedení platby bude klientovi zaslán <strong>daňový doklad (faktura)</strong>{" "}
          e-mailem do 5 pracovních dnů. Faktura slouží jako doklad o zaplacení a je vystavena na
          údaje zadané při objednávce (jméno/firma, adresa, případně IČO pro B2B).
        </P>
        <P>
          Klient je povinen uvést správné fakturační údaje při objednávce. Žádost o změnu faktury
          po jejím vystavení zasílejte na{" "}
          <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>.
        </P>
      </Section>

      <Section title="5. Dodací podmínky – způsob poskytnutí služeb">
        <SubHeading>Online konzultace a supervize:</SubHeading>
        <UL>
          <LI>Prostřednictvím videohovoru (Zoom, Microsoft Teams nebo jiná platforma dle dohody)</LI>
          <LI>Odkaz na videohovor zasílá poskytovatel e-mailem před každým setkáním</LI>
          <LI>Klient potřebuje stabilní internetové připojení, mikrofon a kameru</LI>
        </UL>
        <SubHeading>Osobní konzultace:</SubHeading>
        <UL>
          <LI>Praha nebo Brandýs nad Labem-Stará Boleslav</LI>
          <LI>Konkrétní adresa místa setkání je klientovi sdělena e-mailem po uzavření smlouvy</LI>
        </UL>
        <SubHeading>Workshop Průvodcem v midlife® (prezenční, rezidenční):</SubHeading>
        <UL>
          <LI>Dvoudenní prezenční workshop na sjednaném místě v ČR</LI>
          <LI>Místo konání a ubytovací kapacity jsou sděleny účastníkům nejpozději 14 dní před termínem</LI>
          <LI>V ceně je zahrnuto malé občerstvení a nápoje po oba dny</LI>
          <LI>Doprava, ubytování a stravování (mimo občerstvení) nejsou součástí ceny</LI>
        </UL>
        <SubHeading>Online bonusy k workshopu:</SubHeading>
        <UL>
          <LI>Bonus 1 – Kultivace moudrosti: 3hodinový online workshop (videohovor), termín dohodou po zakoupení</LI>
          <LI>Bonus 2 – Midlife coaching supervize: 2 hodiny online nebo osobní supervize, termín dohodou</LI>
        </UL>
      </Section>

      <Section title="6. Termíny setkání">
        <P>
          Po úspěšné platbě vás poskytovatel kontaktuje e-mailem do <strong>3 pracovních dnů</strong>{" "}
          za účelem sjednání termínu prvního setkání. Setkání je možné domluvit nejdříve do 30 dnů
          od zaplacení, nedohodnou-li se strany jinak.
        </P>
        <P>
          Termíny setkání jsou sjednávány vzájemnou dohodou e-mailem nebo prostřednictvím
          rezervačního systému. Klient obdrží potvrzení termínu e-mailem.
        </P>
      </Section>

      <Section title="7. Platnost balíčků">
        <UL>
          <LI><strong>Krátkodobá spolupráce (3 měsíce)</strong> – setkání čerpat do 4 měsíců od uzavření smlouvy</LI>
          <LI><strong>Střednědobá spolupráce (6 měsíců)</strong> – setkání čerpat do 8 měsíců od uzavření smlouvy</LI>
          <LI><strong>Roční spolupráce</strong> – setkání čerpat do 14 měsíců od uzavření smlouvy</LI>
          <LI><strong>Supervizní balíček (6 setkání)</strong> – setkání čerpat do 12 měsíců od uzavření smlouvy</LI>
        </UL>
        <P>
          Nevyčerpané hodiny po uplynutí platnosti balíčku bez předchozí dohody propadají.
          Prodloužení platnosti lze domluvit individuálně na <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>.
        </P>
      </Section>

      <Section title="8. Kontakt">
        <P>
          Dotazy k platbám a dodacím podmínkám zasílejte na{" "}
          <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>.
          Odpovíme do 2 pracovních dnů.
        </P>
      </Section>
    </LegalPage>
  );
}
