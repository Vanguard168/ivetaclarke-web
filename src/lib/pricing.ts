/**
 * Ceny držíme na jednom místě jako částku **včetně DPH** v haléřích.
 * Základ daně se z ní vždy dopočítá – nikdy se nezapisuje ručně, aby se
 * obě čísla nemohla rozejít (to se stalo u Masterclassu se supervizí:
 * v kódu bylo 23 147,93 Kč místo 23 139,67 Kč, takže by faktura vyšla
 * o 10 Kč jinak, než kolik ComGate skutečně strhl).
 */
export function exVat(priceInclVat: number, vatRate = 21): number {
  return Math.round(priceInclVat / (1 + vatRate / 100));
}
