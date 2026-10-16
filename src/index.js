const digits = (value) => (typeof value === "string" || typeof value === "number" ? String(value).replace(/[\s.\-]/g, "") : "");

/** BSN (burgerservicenummer): 9 digits that pass the "elfproef". Eight digits are read as having a leading zero. */
export function isValidBsn(value) {
  let s = digits(value);
  if (!/^\d{8,9}$/.test(s)) return false;
  s = s.padStart(9, "0");
  if (/^0+$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(s[i]) * (9 - i);
  sum -= Number(s[8]);
  return sum % 11 === 0;
}

/** KvK-nummer: exactly 8 digits. (The chamber of commerce publishes no check digit.) */
export function isValidKvk(value) {
  return /^\d{8}$/.test(digits(value));
}

/** Dutch VAT number: NL + 9 digits + B + 2 digits. Only the format is checked; use VIES to ask whether it is active. */
export function isValidVatNl(value) {
  return typeof value === "string" && /^NL\d{9}B\d{2}$/.test(value.replace(/[\s.\-]/g, "").toUpperCase());
}

/** Dutch postcode: four digits (not starting with 0) and two letters, without SA, SD and SS. */
export function isValidPostcode(value) {
  return typeof value === "string" && /^[1-9]\d{3}\s?(?!SA|SD|SS)[A-Z]{2}$/i.test(value.trim());
}

/** "1234ab" -> "1234 AB", or null when it is not a postcode. */
export function formatPostcode(value) {
  if (!isValidPostcode(value)) return null;
  const s = value.replace(/\s/g, "").toUpperCase();
  return `${s.slice(0, 4)} ${s.slice(4)}`;
}

const IBAN_LENGTH = {
  NL: 18, BE: 16, DE: 22, FR: 27, GB: 22, ES: 24, IT: 27, LU: 20, AT: 20, CH: 21, DK: 18, SE: 24, NO: 15,
  PL: 28, PT: 25, IE: 22, FI: 18, GR: 27, CZ: 24, HU: 28
};

const ibanText = (value) => (typeof value === "string" ? value.replace(/\s/g, "").toUpperCase() : "");

function mod97(text) {
  let rest = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    const part = code >= 65 ? String(code - 55) : ch;
    for (const d of part) rest = (rest * 10 + Number(d)) % 97;
  }
  return rest;
}

/** IBAN: the mod-97 check and, for the countries in the table, the right length. Other countries are accepted on the check alone. */
export function isValidIban(value) {
  const s = ibanText(value);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const expected = IBAN_LENGTH[s.slice(0, 2)];
  if (expected && s.length !== expected) return false;
  return mod97(s.slice(4) + s.slice(0, 4)) === 1;
}

/** "nl91abna0417164300" -> "NL91 ABNA 0417 1643 00", or null when it is not a valid IBAN. */
export function formatIban(value) {
  if (!isValidIban(value)) return null;
  return ibanText(value).replace(/(.{4})/g, "$1 ").trim();
}

/** The bank code of a Dutch IBAN ("ABNA"), or null. */
export function bankCodeNl(value) {
  const s = ibanText(value);
  return isValidIban(s) && s.startsWith("NL") ? s.slice(4, 8) : null;
}

/**
 * Dutch phone number to E.164 (+31...). Accepts 06 12345678, 0031612345678, +31 (0)6 12345678 and the like.
 * Returns `{ e164, kind }` with kind "mobile", "landline" or "service" (0800, 088, 09xx), or null.
 */
export function parsePhoneNl(value) {
  if (typeof value !== "string") return null;
  let s = value.replace(/\(0\)/g, "").replace(/[\s.\-()]/g, "");
  if (s.startsWith("+31")) s = `0${s.slice(3)}`;
  else if (s.startsWith("0031")) s = `0${s.slice(4)}`;
  if (!/^0\d+$/.test(s)) return null;
  const national = s.slice(1);
  let kind;
  if (/^6\d{8}$/.test(national)) kind = "mobile";
  else if (/^(800\d{4,7}|88\d{7}|90\d{5,8})$/.test(national)) kind = "service";
  else if (/^[1-5789]\d{8}$/.test(national)) kind = "landline";
  else return null;
  return { e164: `+31${national}`, kind };
}
