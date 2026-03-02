/**
 * HybridKEM — ML-KEM-768 + X25519
 * ================================
 * Implementação de Key Encapsulation Mechanism (KEM) híbrido pós-quântico
 * para uso no navegador. Combina ML-KEM-768 (resistente a quantum) com X25519
 * (ECDH clássico), derivando um shared secret seguro via HKDF-SHA256.
 *
 * Segurança: A conexão permanece segura enquanto **pelo menos um** dos algoritmos
 * não for quebrado (quantum ou clássico).
 *
 * Dependências:
 * - npm install @noble/post-quantum @noble/curves
 *
 * Imports oficiais (compatíveis com versões recentes):
 * - ML-KEM: '@noble/post-quantum/ml-kem.js'
 * - X25519: '@noble/curves/ed25519.js'
 *
 * Tamanhos esperados (ML-KEM-768):
 * - publicKey.mlkem: 1184 bytes
 * - publicKey.x25519: 32 bytes
 * - privateKey.mlkem: 2400 bytes
 * - privateKey.x25519: 32 bytes
 * - ciphertext.mlkem: 1088 bytes
 * - ciphertext.x25519EphPub: 32 bytes
 * - sharedSecret: 32 bytes
 */

// ─── Imports ─────────────────────────────────────────────────
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import { x25519 } from '@noble/curves/ed25519.js';

// ─── Utilitários internos ────────────────────────────────────
/**
 * Concatena múltiplos Uint8Array em um único array.
 * @param {...Uint8Array} arrays - Arrays a serem concatenados
 * @returns {Uint8Array} Array concatenado
 */
function concat(...arrays) {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Deriva bytes usando HKDF-SHA256 (Web Crypto API).
 * @param {Uint8Array} ikm - Input Keying Material (concatenação dos shared secrets)
 * @param {Uint8Array} info - Contexto/info string (concatenação de ciphertext + pubkey)
 * @param {number} [len=32] - Tamanho do output em bytes
 * @returns {Promise<Uint8Array>} Bytes derivados
 */
async function hkdf(ikm, info, len = 32) {
  const key = await crypto.subtle.importKey(
    'raw',
    ikm,
    { name: 'HKDF' },
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new Uint8Array(32), // Salt zero é aceitável em construções híbridas
      info,
    },
    key,
    len * 8
  );
  return new Uint8Array(derived);
}

/**
 * Codifica Uint8Array para base64url (sem padding, URL-safe).
 * @param {Uint8Array} u8 - Bytes a codificar
 * @returns {string} String base64url
 */
function b64enc(u8) {
  return btoa(String.fromCharCode(...u8))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decodifica string base64url para Uint8Array.
 * @param {string} s - String base64url
 * @returns {Uint8Array} Bytes decodificados
 */
function b64dec(s) {
  const cleaned = s.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ─── API pública ─────────────────────────────────────────────
/**
 * Objeto principal com todas as funções do Hybrid KEM.
 * @namespace
 */
export const HybridKEM = {
  /**
   * Gera um novo par de chaves híbridas (ML-KEM-768 + X25519).
   * @returns {Promise<{
   *   publicKey: { mlkem: Uint8Array, x25519: Uint8Array },
   *   privateKey: { mlkem: Uint8Array, x25519: Uint8Array }
   * }>}
   */
  async generateKeyPair() {
    const { publicKey, secretKey } = ml_kem768.keygen(); // usa entropy interno

    const x25519Priv = crypto.getRandomValues(new Uint8Array(32));
    const x25519Pub = x25519.getPublicKey(x25519Priv);

    return {
      publicKey: { mlkem: publicKey, x25519: x25519Pub },
      privateKey: { mlkem: secretKey, x25519: x25519Priv },
    };
  },

  /**
   * Encapsula um shared secret usando a public key do destinatário.
   * Deve ser chamado pelo iniciador da conexão.
   * @param {{ mlkem: Uint8Array, x25519: Uint8Array }} recipientPublicKey - Chave pública do peer
   * @returns {Promise<{
   *   ciphertext: { mlkem: Uint8Array, x25519EphPub: Uint8Array },
   *   sharedSecret: Uint8Array
   * }>}
   * @throws {Error} Se tamanhos das chaves estiverem incorretos
   */
  async encapsulate(recipientPublicKey) {
    if (recipientPublicKey.mlkem?.length !== 1184) {
      throw new Error(`Chave pública ML-KEM inválida: ${recipientPublicKey.mlkem?.length ?? 'undefined'} bytes (esperado 1184)`);
    }
    if (recipientPublicKey.x25519?.length !== 32) {
      throw new Error(`Chave pública X25519 inválida: ${recipientPublicKey.x25519?.length ?? 'undefined'} bytes (esperado 32)`);
    }

    const { cipherText: mlkemCT, sharedSecret: mlkemSS } = ml_kem768.encapsulate(
      recipientPublicKey.mlkem,
      crypto.getRandomValues(new Uint8Array(32))
    );

    const ephPriv = crypto.getRandomValues(new Uint8Array(32));
    const ephPub = x25519.getPublicKey(ephPriv);
    const x25519SS = x25519.getSharedSecret(ephPriv, recipientPublicKey.x25519);

    const sharedSecret = await hkdf(
      concat(mlkemSS, x25519SS),
      concat(mlkemCT, recipientPublicKey.mlkem)
    );

    return {
      ciphertext: { mlkem: mlkemCT, x25519EphPub: ephPub },
      sharedSecret,
    };
  },

  /**
   * Decapsula o ciphertext e recupera o shared secret.
   * Deve ser chamado pelo receptor da conexão.
   * @param {{ mlkem: Uint8Array, x25519EphPub: Uint8Array }} ciphertext - Ciphertext recebido
   * @param {{ mlkem: Uint8Array, x25519: Uint8Array }} privateKey - Chave privada própria
   * @param {{ mlkem: Uint8Array, x25519: Uint8Array }} ownPublicKey - Chave pública própria (necessária para HKDF info)
   * @returns {Promise<Uint8Array>} Shared secret de 32 bytes
   * @throws {Error} Se tamanhos estiverem incorretos
   */
  async decapsulate(ciphertext, privateKey, ownPublicKey) {
    if (ciphertext.mlkem?.length !== 1088) {
      throw new Error(`Ciphertext ML-KEM inválido: ${ciphertext.mlkem?.length ?? 'undefined'} bytes (esperado 1088)`);
    }
    if (ciphertext.x25519EphPub?.length !== 32) {
      throw new Error(`Ephemeral pub X25519 inválida: ${ciphertext.x25519EphPub?.length ?? 'undefined'} bytes (esperado 32)`);
    }
    if (privateKey.mlkem?.length !== 2400) {
      throw new Error(`Private key ML-KEM inválida: ${privateKey.mlkem?.length ?? 'undefined'} bytes (esperado 2400)`);
    }
    if (privateKey.x25519?.length !== 32) {
      throw new Error(`Private key X25519 inválida: ${privateKey.x25519?.length ?? 'undefined'} bytes (esperado 32)`);
    }
    if (ownPublicKey.mlkem?.length !== 1184) {
      throw new Error(`Public key própria ML-KEM inválida: ${ownPublicKey.mlkem?.length ?? 'undefined'} bytes (esperado 1184)`);
    }

    const mlkemSS = ml_kem768.decapsulate(ciphertext.mlkem, privateKey.mlkem);
    const x25519SS = x25519.getSharedSecret(privateKey.x25519, ciphertext.x25519EphPub);

    return hkdf(
      concat(mlkemSS, x25519SS),
      concat(ciphertext.mlkem, ownPublicKey.mlkem)
    );
  },

  /**
   * Compara dois shared secrets de forma constante em tempo (contra timing attacks).
   * @param {Uint8Array} a - Primeiro secret
   * @param {Uint8Array} b - Segundo secret
   * @returns {boolean} True se iguais, false caso contrário
   */
  secretsEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      diff |= a[i] ^ b[i];
    }
    return diff === 0;
  },

  /**
   * Codifica Uint8Array para base64url (sem padding, seguro para URL/JSON).
   * @param {Uint8Array} u8 - Bytes a codificar
   * @returns {string} String base64url
   */
  b64enc,

  /**
   * Decodifica string base64url para Uint8Array.
   * @param {string} s - String base64url
   * @returns {Uint8Array} Bytes decodificados
   */
  b64dec,

  /**
   * Serializa chave pública híbrida para objeto JSON-safe.
   * @param {{ mlkem: Uint8Array, x25519: Uint8Array }} publicKey
   * @returns {{ mlkem: string, x25519: string }}
   */
  serializePublicKey: ({ mlkem, x25519 }) => ({
    mlkem: b64enc(mlkem),
    x25519: b64enc(x25519),
  }),

  /**
   * Deserializa chave pública híbrida de objeto JSON.
   * @param {{ mlkem: string, x25519: string }} serialized
   * @returns {{ mlkem: Uint8Array, x25519: Uint8Array }}
   */
  deserializePublicKey: ({ mlkem, x25519 }) => ({
    mlkem: b64dec(mlkem),
    x25519: b64dec(x25519),
  }),

  /**
   * Serializa ciphertext híbrido para JSON.
   * @param {{ mlkem: Uint8Array, x25519EphPub: Uint8Array }} ciphertext
   * @returns {{ mlkem: string, x25519EphPub: string }}
   */
  serializeCiphertext: ({ mlkem, x25519EphPub }) => ({
    mlkem: b64enc(mlkem),
    x25519EphPub: b64enc(x25519EphPub),
  }),

  /**
   * Deserializa ciphertext híbrido de JSON.
   * @param {{ mlkem: string, x25519EphPub: string }} serialized
   * @returns {{ mlkem: Uint8Array, x25519EphPub: Uint8Array }}
   */
  deserializeCiphertext: ({ mlkem, x25519EphPub }) => ({
    mlkem: b64dec(mlkem),
    x25519EphPub: b64dec(x25519EphPub),
  }),
};

export default HybridKEM;
