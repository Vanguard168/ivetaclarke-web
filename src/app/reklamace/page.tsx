import type { Metadata } from "next";
import { LegalPage, Section, P, UL, LI, InfoBox, SubHeading, company } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Reklamační podmínky – Iveta Clarke",
};

export default function ReklamacePage() {
  return (
    <LegalPage
      title="Reklamační podmínky"
      subtitle="Reklamační řád dle zákona č. 634/1992 Sb. · Platné od 1. 7. 2026"
    >
      <Section title="1. Úvodní ustanovení">
        <P>
          Tyto reklamační podmínky upravují způsob uplatnění reklamace u poskytovatele služeb:
        </P>
        <InfoBox>
          {company.name}<br />
          {company.address}<br />
          IČO: {company.ico} · DIČ: {company.dic}<br />
          E-mail: <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>
        </InfoBox>
        <P>
          Reklamační podmínky se vztahují na koučovací, mentorské a supervizní služby a výcvikové
          workshopy poskytované prostřednictvím <strong>ivetaclarke.com</strong>.
        </P>
      </Section>

      <Section title="2. Práva z vadného plnění">
        <P>
          Poskytovatel odpovídá za to, že služba bude poskytována s odbornou péčí, v dohodnutém
          rozsahu a kvalitě. Záruční doba na poskytnuté služby je <strong>24 měsíců</strong> od
          jejich poskytnutí (§ 1914 a násl. OZ).
        </P>
        <P>Za vadu plnění se považuje zejména:</P>
        <UL>
          <LI>Neposkytnutí sjednané služby bez náhrady (zrušení setkání bez nabídky náhradního termínu)</LI>
          <LI>Podstatná odchylka od sjednaného rozsahu nebo obsahu služby</LI>
          <LI>Technická závada na straně poskytovatele bránící poskytnutí online setkání</LI>
        </UL>
        <P>
          Za vadu se naopak nepovažuje nespokojenost klienta s výsledkem koučovacího nebo
          supervizního procesu, neboť výsledek závisí na aktivní participaci samotného klienta.
        </P>
      </Section>

      <Section title="3. Jak uplatnit reklamaci">
        <P>
          Reklamaci uplatňujte výhradně e-mailem na{" "}
          <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>{" "}
          s předmětem: <strong>REKLAMACE</strong>.
        </P>
        <P>E-mail musí obsahovat:</P>
        <UL>
          <LI>Jméno a příjmení klienta</LI>
          <LI>Číslo objednávky nebo datum poskytnuté služby</LI>
          <LI>Popis vady / důvod reklamace</LI>
          <LI>Kontaktní e-mail nebo telefon</LI>
          <LI>Požadovaný způsob řešení (viz níže)</LI>
        </UL>
      </Section>

      <Section title="4. Způsoby řešení reklamace">
        <P>Klient může požadovat:</P>
        <UL>
          <LI><strong>Náhradní termín</strong> – bezplatné poskytnutí služby v náhradním termínu</LI>
          <LI><strong>Slevu z ceny</strong> – přiměřené snížení ceny odpovídající rozsahu vady</LI>
          <LI><strong>Vrácení ceny</strong> – v případě podstatné vady, pokud náhradní termín není možný</LI>
        </UL>
      </Section>

      <Section title="5. Lhůty">
        <UL>
          <LI>Potvrzení přijetí reklamace: do <strong>2 pracovních dnů</strong></LI>
          <LI>Vyřízení reklamace: do <strong>30 dnů</strong> od jejího uplatnění (§ 19 odst. 3 zák. č. 634/1992 Sb.)</LI>
          <LI>V případě nutnosti delšího šetření bude klient informován o průběhu</LI>
        </UL>
      </Section>

      <Section title="6. Storno podmínky a vrácení peněz">
        <SubHeading>Individuální setkání (konzultace, supervize):</SubHeading>
        <UL>
          <LI>Zrušení více než 48 hodin před termínem – <strong>bez poplatku</strong>, termín lze přeložit</LI>
          <LI>Zrušení méně než 48 hodin před termínem – <strong>50 % z ceny</strong> daného setkání</LI>
          <LI>Nedostavení se bez omluvy – <strong>100 % ceny</strong> daného setkání propadá</LI>
        </UL>
        <SubHeading>Workshop Průvodcem v midlife®:</SubHeading>
        <UL>
          <LI>Zrušení více než 30 dnů před termínem – vrácení <strong>100 %</strong> ceny</LI>
          <LI>Zrušení 14–30 dnů před termínem – vrácení <strong>50 %</strong> ceny</LI>
          <LI>Zrušení méně než 14 dnů před termínem – <strong>bez nároku</strong> na vrácení ceny</LI>
          <LI>Zrušení workshopu poskytovatelem – vrácení <strong>100 %</strong> ceny</LI>
        </UL>
        <SubHeading>Vrácení peněz:</SubHeading>
        <P>
          Schválené vratky jsou realizovány do 14 dnů od rozhodnutí o reklamaci, a to stejným
          způsobem, jakým byla platba uhrazena (platba kartou → vrácení na kartu apod.).
        </P>
      </Section>

      <Section title="7. Právo na odstoupení od smlouvy">
        <P>
          Spotřebitel má právo odstoupit od smlouvy do 14 dnů od jejího uzavření bez udání důvodu
          dle § 1829 OZ. Podrobnosti jsou uvedeny ve{" "}
          <a href="/vop" style={{ color: "#C9A84C" }}>Všeobecných obchodních podmínkách</a>.
        </P>
      </Section>

      <Section title="8. Mimosoudní řešení sporů">
        <P>
          Spotřebitel má právo na mimosoudní řešení sporu u{" "}
          <strong>České obchodní inspekce (ČOI)</strong>:{" "}
          <a href="https://www.coi.cz" target="_blank" rel="noopener noreferrer" style={{ color: "#C9A84C" }}>www.coi.cz</a>.
        </P>
        <P>
          Evropská platforma ODR:{" "}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: "#C9A84C" }}>ec.europa.eu/consumers/odr</a>.
        </P>
      </Section>
    </LegalPage>
  );
}
