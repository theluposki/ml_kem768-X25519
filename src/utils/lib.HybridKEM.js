import { HybridKEM } from './hybrid-kem.js'

// ── Alice gera suas chaves e compartilha a publicKey ──
const alice = await HybridKEM.generateKeyPair()
// alice.publicKey  → { mlkem: Uint8Array(1184), x25519: Uint8Array(32) }
// alice.privateKey → { mlkem: Uint8Array(2400), x25519: Uint8Array(32) }

// ── Bob encapsula com a publicKey de Alice ──
const { ciphertext, sharedSecret: bobSecret } =
  await HybridKEM.encapsulate(alice.publicKey)

// ── Alice decapsula com sua privateKey ──
const aliceSecret = await HybridKEM.decapsulate(
  ciphertext,
  alice.privateKey,
  alice.publicKey   // necessário para o binding do HKDF
)

// ── Verificar (sempre em tempo constante) ──
console.log(HybridKEM.secretsEqual(aliceSecret, bobSecret)) // true
// Ambos têm 32 bytes idênticos → usam como chave AES-256, por exemplo





// Alice → serializa a publicKey e envia para Bob (via fetch, WebSocket etc.)
const payload = HybridKEM.serializePublicKey(alice.publicKey)
// payload = { mlkem: "base64url...", x25519: "base64url..." }
await fetch('/bob', { method: 'POST', body: JSON.stringify(payload) })

// Bob → deserializa, encapsula, envia o ciphertext de volta
const pubKey = HybridKEM.deserializePublicKey(payload)
const { ciphertext, sharedSecret: bobSecret } = await HybridKEM.encapsulate(pubKey)
await fetch('/alice', {
  method: 'POST',
  body: JSON.stringify(HybridKEM.serializeCiphertext(ciphertext))
})

// Alice → deserializa e decapsula
const ct = HybridKEM.deserializeCiphertext(await response.json())
const aliceSecret = await HybridKEM.decapsulate(ct, alice.privateKey, alice.publicKey)


const aesKey = await crypto.subtle.importKey(
  'raw', aliceSecret,
  { name: 'AES-GCM' },
  false,
  ['encrypt', 'decrypt']
)

const iv = crypto.getRandomValues(new Uint8Array(12))
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  aesKey,
  new TextEncoder().encode('mensagem secreta')
)
