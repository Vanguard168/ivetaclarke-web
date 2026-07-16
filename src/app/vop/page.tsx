import type { Metadata } from "next";
import { LegalPage, Section, P, UL, LI, InfoBox, SubHeading, company } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Všeobecné obchodní podmínky – Iveta Clarke",
};

export default function VopPage() {
  return (
    <LegalPage
      title="Všeobecné obchodní podmínky"
      subtitle="Platné od 1. 7. 2026"
    >
      <Section title="1. Úvodní ustanovení">
        <P>
          Tyto všeobecné obchodní podmínky (dále jen „VOP") upravují práva a povinnosti smluvních
          stran vzniklé v souvislosti s uzavřením smlouvy o poskytnutí služeb prostřednictvím
          webového rozhraní <strong>https://ivetaclarke.com</strong> (dále jen „webové rozhraní").
        </P>
        <InfoBox>
          <strong>Poskytovatel:</strong><br />
          {company.name}<br />
          {company.address}<br />
          IČO: {company.ico} · DIČ: {company.dic}<br />
          Tel.: <a href={`tel:+420724001030`} style={{ color: "#C9A84C" }}>{company.phone}</a><br />
          E-mail: <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>
        </InfoBox>
        <P>
          Kupující/klient je fyzická nebo právnická osoba, která uzavírá smlouvu o poskytnutí
          služeb (dále jen „klient"). Podáním objednávky klient potvrzuje, že se seznámil s těmito
          VOP a bez výhrad s nimi souhlasí.
        </P>
      </Section>

      <Section title="2. Předmět smlouvy">
        <P>
          Předmětem smlouvy je poskytnutí koučovacích, mentorských nebo supervizních služeb,
          případně účast na výcvikovém workshopu, dle specifikace na webovém rozhraní. Konkrétně
          se jedná o tyto kategorie:
        </P>
        <UL>
          <LI>Individuální konzultace a koučovací balíčky (online i osobní)</LI>
          <LI>Supervize pro kouče (jednorázová nebo balíček setkání)</LI>
          <LI>Výcvikový workshop Průvodcem v midlife® (prezenční, rezidenční)</LI>
        </UL>
      </Section>

      <Section title="3. Objednávka a uzavření smlouvy">
        <P>
          Smlouva je uzavřena okamžikem, kdy je objednávka klienta přijata poskytovatelem, tj. po
          úspěšném provedení platby prostřednictvím webového rozhraní. Klient obdrží potvrzení
          o přijaté platbě e-mailem.
        </P>
        <P>
          Poskytovatel si vyhrazuje právo objednávku nepřijmout, zejména v případě, kdy kapacita
          dané služby je vyčerpána. V takovém případě bude uhrazená cena vrácena v plné výši.
        </P>
      </Section>

      <Section title="4. Cena a platební podmínky">
        <P>
          Ceny služeb jsou uvedeny na webovém rozhraní vždy včetně DPH. Poskytovatel je plátcem
          DPH.
        </P>
        <P>
          Platba probíhá výhradně bezhotovostně prostřednictvím platební brány ComGate
          (platební kartou Visa/Mastercard, Apple Pay nebo Google Pay). Cena je splatná před
          zahájením poskytování služby.
        </P>
        <P>
          Daňový doklad (faktura) bude klientovi zaslán e-mailem do 5 pracovních dnů od přijetí
          platby.
        </P>
      </Section>

      <Section title="5. Dodací podmínky">
        <P>Způsob poskytnutí služby závisí na zvoleném balíčku:</P>
        <UL>
          <LI><strong>Online konzultace a supervize:</strong> videohovor prostřednictvím platformy dle dohody (Zoom, Teams apod.)</LI>
          <LI><strong>Osobní konzultace:</strong> Praha nebo Brandýs nad Labem-Stará Boleslav – konkrétní místo sděleno po uzavření smlouvy</LI>
          <LI><strong>Workshop:</strong> prezenční, rezidenční – místo konání sděleno účastníkům nejpozději 14 dní před termínem</LI>
        </UL>
        <P>
          Termíny individuálních setkání jsou sjednávány prostřednictvím e-mailu nebo rezervačního
          systému. Poskytovatel se zavazuje nabídnout první termín do 30 dnů od uzavření smlouvy,
          nedohodnou-li se strany jinak.
        </P>
      </Section>

      <Section title="6. Právo na odstoupení od smlouvy">
        <P>
          Spotřebitel má právo odstoupit od smlouvy uzavřené prostřednictvím webového rozhraní bez
          udání důvodu ve lhůtě <strong>14 dnů</strong> od jejího uzavření (§ 1829 zákona č. 89/2012 Sb.,
          občanský zákoník – dále jen „OZ").
        </P>
        <P>
          Klient bere na vědomí, že udělením výslovného souhlasu se zahájením poskytování služby
          před uplynutím lhůty pro odstoupení <strong>právo na odstoupení zaniká</strong> (§ 1837
          písm. a) OZ). Zahájením se rozumí absolvování prvního sjednaného setkání.
        </P>
        <P>
          Odstoupení od smlouvy je nutné zaslat e-mailem na{" "}
          <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>{" "}
          s uvedením čísla objednávky. V případě platného odstoupení bude cena vrácena do 14 dnů
          od doručení odstoupení na stejný platební prostředek.
        </P>
      </Section>

      <Section title="7. Storno podmínky">
        <SubHeading>Individuální setkání (konzultace, supervize):</SubHeading>
        <UL>
          <LI>Zrušení více než 48 hodin před termínem – bez stornopoplatku, termín lze přeložit</LI>
          <LI>Zrušení méně než 48 hodin před termínem – účtuje se 50 % z ceny daného setkání</LI>
          <LI>Nedostavení se bez omluvy – účtuje se 100 % ceny daného setkání</LI>
        </UL>
        <SubHeading>Workshop Průvodcem v midlife®:</SubHeading>
        <UL>
          <LI>Zrušení více než 30 dnů před termínem – vrácení 100 % ceny</LI>
          <LI>Zrušení 14–30 dnů před termínem – vrácení 50 % ceny</LI>
          <LI>Zrušení méně než 14 dnů před termínem – bez nároku na vrácení ceny</LI>
          <LI>Zrušení workshopu poskytovatelem – vrácení 100 % ceny</LI>
        </UL>
        <P>
          Storno je nutné zaslat e-mailem na{" "}
          <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>.
          Rozhodující je datum doručení e-mailu poskytovateli.
        </P>
      </Section>

      <Section title="8. Reklamace">
        <P>
          Reklamace se řídí Reklamačním řádem, dostupným na{" "}
          <a href="/reklamace" style={{ color: "#C9A84C" }}>ivetaclarke.com/reklamace</a>.
          Klient je oprávněn uplatnit reklamaci do 24 měsíců od poskytnutí služby.
        </P>
      </Section>

      <Section title="9. Ochrana osobních údajů">
        <P>
          Zpracování osobních údajů se řídí Zásadami ochrany osobních údajů, dostupnými na{" "}
          <a href="/gdpr" style={{ color: "#C9A84C" }}>ivetaclarke.com/gdpr</a>.
        </P>
      </Section>

      <Section title="10. Mimosoudní řešení sporů">
        <P>
          Spotřebitel má právo na mimosoudní řešení spotřebitelského sporu u{" "}
          <strong>České obchodní inspekce (ČOI)</strong>:{" "}
          <a href="https://www.coi.cz" target="_blank" rel="noopener noreferrer" style={{ color: "#C9A84C" }}>www.coi.cz</a>.
        </P>
        <P>
          Evropská platforma pro online řešení sporů (ODR):{" "}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: "#C9A84C" }}>ec.europa.eu/consumers/odr</a>.
        </P>
      </Section>

      <Section title="11. Závěrečná ustanovení">
        <UL>
          <LI>Tyto VOP jsou platné od 1. 7. 2026.</LI>
          <LI>Právní vztahy se řídí právním řádem České republiky, zejm. zákonem č. 89/2012 Sb. (OZ) a zákonem č. 634/1992 Sb. (ochrana spotřebitele).</LI>
          <LI>Poskytovatel si vyhrazuje právo VOP měnit. Změny jsou účinné zveřejněním na webovém rozhraní.</LI>
          <LI>Veškerá komunikace probíhá e-mailem: <a href={`mailto:${company.email}`} style={{ color: "#C9A84C" }}>{company.email}</a>.</LI>
        </UL>
      </Section>
    </LegalPage>
  );
}
