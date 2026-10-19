/** Imported public keys, by hex string */
const keys = new Map<string, Promise<CryptoKey>>();

/**
 * Decode a hex string
 * @param hex hex string
 * @returns bytes, or undefined if it is not valid hex
 */
function hexToBytes(hex: string): Uint8Array | undefined {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(hex)) return undefined;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Check the signature Discord puts on interaction requests
 * @param request interaction request
 * @param publicKey application public key (hex)
 * @returns the request body if the signature is valid
 */
export async function verifyInteraction(
  request: Request,
  publicKey: string,
): Promise<string | undefined> {
  const signature = hexToBytes(
    request.headers.get('X-Signature-Ed25519') ?? '',
  );
  const timestamp = request.headers.get('X-Signature-Timestamp');
  const body = await request.text();
  if (!signature || timestamp === null) return undefined;

  const keyBytes = hexToBytes(publicKey);
  if (!keyBytes) return undefined;
  let key = keys.get(publicKey);
  if (!key) {
    key = crypto.subtle.importKey('raw', keyBytes, { name: 'Ed25519' }, false, [
      'verify',
    ]);
    keys.set(publicKey, key);
  }

  try {
    const valid = await crypto.subtle.verify(
      { name: 'Ed25519' },
      await key,
      signature,
      new TextEncoder().encode(timestamp + body),
    );
    return valid ? body : undefined;
  } catch {
    return undefined;
  }
}
