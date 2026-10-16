import assert from "node:assert/strict";
import { test } from "node:test";

import { bankCodeNl, formatIban, formatPostcode, isValidBsn, isValidIban, isValidKvk, isValidPostcode, isValidVatNl, parsePhoneNl } from "./src/index.js";

test("BSN elfproef", () => {
  assert.equal(isValidBsn("111222333"), true);
  assert.equal(isValidBsn("111 222 333"), true);
  assert.equal(isValidBsn(111222333), true);
  assert.equal(isValidBsn("11222333"), false); // eight digits read as 011222333, which fails
  assert.equal(isValidBsn("111222334"), false);
  assert.equal(isValidBsn("000000000"), false);
  assert.equal(isValidBsn("12345"), false);
  assert.equal(isValidBsn("abcdefghi"), false);
  assert.equal(isValidBsn(null), false);
});

test("KvK and VAT", () => {
  assert.equal(isValidKvk("12345678"), true);
  assert.equal(isValidKvk("1234567"), false);
  assert.equal(isValidKvk("1234567a"), false);
  assert.equal(isValidVatNl("NL123456789B01"), true);
  assert.equal(isValidVatNl("nl 1234.56.789 b01"), true);
  assert.equal(isValidVatNl("NL123456789"), false);
  assert.equal(isValidVatNl("BE123456789B01"), false);
});

test("postcode", () => {
  for (const ok of ["1234AB", "1234 ab", " 9999 ZZ "]) assert.equal(isValidPostcode(ok), true, ok);
  for (const bad of ["0123AB", "1234SA", "1234 SS", "1234SD", "123AB", "1234A", "ABCD12", ""]) assert.equal(isValidPostcode(bad), false, bad);
  assert.equal(formatPostcode("1234ab"), "1234 AB");
  assert.equal(formatPostcode("x"), null);
});

test("IBAN", () => {
  assert.equal(isValidIban("NL91ABNA0417164300"), true);
  assert.equal(isValidIban("nl91 abna 0417 1643 00"), true);
  assert.equal(isValidIban("NL91ABNA0417164301"), false);
  assert.equal(isValidIban("NL91ABNA041716430"), false); // wrong length for NL
  assert.equal(isValidIban("DE89370400440532013000"), true);
  assert.equal(isValidIban("GB82WEST12345698765432"), true);
  assert.equal(isValidIban("1234"), false);
  assert.equal(isValidIban(undefined), false);
  assert.equal(formatIban("nl91abna0417164300"), "NL91 ABNA 0417 1643 00");
  assert.equal(formatIban("NL00ABNA0417164300"), null);
  assert.equal(bankCodeNl("NL91ABNA0417164300"), "ABNA");
  assert.equal(bankCodeNl("DE89370400440532013000"), null);
});

test("phone numbers", () => {
  const mobile = { e164: "+31612345678", kind: "mobile" };
  for (const s of ["06 12345678", "06-12345678", "0612345678", "+31612345678", "0031612345678", "+31 (0)6 12345678"]) assert.deepEqual(parsePhoneNl(s), mobile, s);
  assert.deepEqual(parsePhoneNl("020 1234567"), { e164: "+31201234567", kind: "landline" });
  assert.deepEqual(parsePhoneNl("(0111) 123456"), { e164: "+31111123456", kind: "landline" });
  assert.deepEqual(parsePhoneNl("0800 0224"), { e164: "+318000224", kind: "service" });
  for (const bad of ["12345", "06 1234567", "+32 470 12 34 56", "abc", "", null]) assert.equal(parsePhoneNl(bad), null, String(bad));
});
