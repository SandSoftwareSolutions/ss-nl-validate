export function isValidBsn(value: unknown): boolean;
export function isValidKvk(value: unknown): boolean;
export function isValidVatNl(value: unknown): boolean;
export function isValidPostcode(value: unknown): boolean;
export function formatPostcode(value: unknown): string | null;
export function isValidIban(value: unknown): boolean;
export function formatIban(value: unknown): string | null;
export function bankCodeNl(value: unknown): string | null;
export function parsePhoneNl(value: unknown): { e164: string; kind: "mobile" | "landline" | "service" } | null;
