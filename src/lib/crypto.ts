/**
 * Hashes a Vault ID using SHA-256 via the Web Crypto API.
 * The plain-text vault ID never leaves the browser.
 * Returns a lowercase hex string.
 */
export async function hashVaultId(vaultId: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(vaultId.trim())
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
