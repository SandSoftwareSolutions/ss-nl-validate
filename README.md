# @sandsoftwaresolutions/nl-validate

[![CI](https://github.com/SandSoftwareSolutions/ss-nl-validate/actions/workflows/ci.yml/badge.svg)](https://github.com/SandSoftwareSolutions/ss-nl-validate/actions/workflows/ci.yml)

Check the Dutch things you keep needing in forms and imports: BSN, IBAN, KvK number, VAT number, postcode and phone numbers. Each check is one function that returns `true`/`false` (or the cleaned-up value, or `null`). No dependencies.

## Install

```bash
npm install @sandsoftwaresolutions/nl-validate
```

Works with `import` and `require()`, and ships TypeScript types for both.

## Usage

```js
import { isValidIban, formatIban, isValidPostcode, formatPostcode, parsePhoneNl, isValidBsn } from "@sandsoftwaresolutions/nl-validate";

isValidIban("nl91 abna 0417 1643 00");   // true
formatIban("nl91abna0417164300");        // "NL91 ABNA 0417 1643 00"
formatPostcode("1234ab");                // "1234 AB"
parsePhoneNl("+31 (0)6 12345678");       // { e164: "+31612345678", kind: "mobile" }
isValidBsn("111222333");                 // true
```

Spaces, dots and dashes in a text are ignored (`isValidIban` ignores spaces only, and accepts ASCII letters and digits only). A number is accepted for BSN and KvK only when it is a whole number. Anything else that is not a string is simply invalid; the functions never throw.

## What each one checks

| Function | Checks |
| --- | --- |
| `isValidBsn` | 9 digits and the elfproef (8 digits are read with a leading zero); all zeros is refused |
| `isValidKvk` | exactly 8 digits (there is no published check digit) |
| `isValidVatNl` | the format `NL` + 9 digits + `B` + 2 digits. It does **not** ask whether the number is active; use VIES for that |
| `isValidPostcode` / `formatPostcode` | four digits not starting with 0, two letters, without SA, SD and SS |
| `isValidIban` / `formatIban` | the mod-97 check, and the exact length for NL, BE, DE, FR, GB, ES, IT, LU, AT, CH, DK, SE, NO, PL, PT, IE, FI, GR, CZ and HU. Other countries pass on the check digits alone |
| `bankCodeNl` | the bank code of a Dutch IBAN ("ABNA", "INGB", "RABO") |
| `parsePhoneNl` | Dutch numbers to E.164, and whether it is `mobile`, `landline` or `service` (0800, 088, 09xx) |

## Not included

A valid IBAN or BSN is only well-formed: it does not prove that the account or person exists. Treat a BSN as personal data under the GDPR and store it only when the law requires it.
