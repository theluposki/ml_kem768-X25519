<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { Emitter } from '@/utils/Emitter.js'
import { useMyUserStore } from '@/stores/myuser'
import { fileToBase64 } from '@/utils/imageUtils.js'
import { saveProfile } from '@/utils/profileStorage.js'
import { HybridKEM } from '@/utils/hybrid-kem.js'

onMounted(() => {
  Emitter.emit('active-btn-back')
  loadOrGenerateKeys();  // Carrega ou gera chaves híbridas ao montar
})

const myUserStore = useMyUserStore();
const perfil = computed(() => myUserStore.myUser)

const inputCapa = ref(null)
const inputProfile = ref(null)

watch(
  () => perfil.value.nickname,
  () => saveProfile(myUserStore.myUser)
)

function escolherCapa() {
  inputCapa.value.click()
}

function escolherFotoPerfil() {
  inputProfile.value.click()
}

async function onCapaChange(event) {
  const file = event.target.files[0]
  if (!file) return
  const base64 = await fileToBase64(file)
  myUserStore.myUser.imageCapa = base64
  saveProfile(myUserStore.myUser)
}

async function onProfileChange(event) {
  const file = event.target.files[0]
  if (!file) return
  const base64 = await fileToBase64(file)
  myUserStore.myUser.imageProfile = base64
  saveProfile(myUserStore.myUser)
}

// ─── Lógica das chaves híbridas ──────────────────────────────────
const hasKeys = computed(() => !!perfil.value.hybridKeys?.publicKey);

// Carrega chaves existentes ou gera novas
async function loadOrGenerateKeys() {
  if (hasKeys.value) {
    console.log('Chaves híbridas já existem no perfil');
    return;
  }

  // Se não existir, gera automaticamente (ou pergunte ao usuário)
  await generateAndSaveKeys();
}

// Gera e salva as chaves
async function generateAndSaveKeys() {
  try {
    const keys = await HybridKEM.generateKeyPair();

    // Serializa para base64url (seguro para JSON/localStorage)
    const serializedPub = HybridKEM.serializePublicKey(keys.publicKey);
    const serializedPriv = {
      mlkem: HybridKEM.b64enc(keys.privateKey.mlkem),  // use b64enc do hybrid-kem.js
      x25519: HybridKEM.b64enc(keys.privateKey.x25519)
    };

    // Salva no store
    myUserStore.myUser.hybridKeys = {
      publicKey: serializedPub,
      privateKey: serializedPriv
    };

    saveProfile(myUserStore.myUser);
    console.log('Chaves híbridas geradas e salvas!');
    console.log('X25519 Pub length (deserializado):', HybridKEM.deserializePublicKey(serializedPub).x25519.length); // 32
    console.log('ML-KEM Pub length:', HybridKEM.deserializePublicKey(serializedPub).mlkem.length); // 1184
  } catch (err) {
    console.error('Erro ao gerar/salvar chaves híbridas:', err);
  }
}

</script>

<template>
  <div class="myPerfil page">
    <div class="capa" :style="perfil.imageCapa ? `background-image: url('${perfil.imageCapa}')` : ''">

      <!-- Botão editar capa -->
      <button class="btn-edit-capa" @click="escolherCapa" title="Alterar foto de capa">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8
                   a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        Alterar capa
      </button>
      <input ref="inputCapa" type="file" accept="image/*" class="input-hidden" @change="onCapaChange" />

      <!-- Foto de perfil -->
      <div class="wrapperImageprofile" @click="escolherFotoPerfil" title="Alterar foto de perfil">
        <img :src="perfil.imageProfile" alt="imagem de perfil">
        <div class="overlay-profile">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8
                     a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
      </div>
      <input ref="inputProfile" type="file" accept="image/*" class="input-hidden" @change="onProfileChange" />

    </div>

    <div class="wrapperInputs">
      <div class="form-control">
        <label for="nickname">nickname</label>
        <input class="input" type="text" id="nickname" v-model="perfil.nickname" placeholder="seu nome de usúario.">
      </div>
    </div>

    <div class="wrapperKeys">
      <button @click="generateAndSaveKeys">
        {{ hasKeys ? 'Regenerar Chaves Híbridas (PQ)' : 'Gerar Chaves Híbridas (PQ)' }}
      </button>
      <p v-if="hasKeys">
        Chaves híbridas já existem no perfil
      </p>

      <div class="keys">

        <div class="key private">
          <strong>Chave Privada</strong>
          <b>mlkem</b>
          <span>{{ perfil.hybridKeys.privateKey.mlkem.substring(0, 400) }}&spnb;<b>...</b></span>
          <b>x25519</b>
          <span>{{ perfil.hybridKeys.privateKey.x25519.substring(0, 200) }}</span>
        </div>

                <div class="key public">
          <strong>Chave publica</strong>
          <b>mlkem</b>
          <span>{{ perfil.hybridKeys.publicKey.mlkem.substring(0, 400) }}&spnb;<b>...</b></span>
          <b>x25519</b>
          <span>{{ perfil.hybridKeys.publicKey.x25519.substring(0, 200) }}</span>
        </div>


      </div>
    </div>
  </div>
</template>

<style scoped>
.myPerfil {
  flex: 1;
  --wh-imageProfile: 180px;
  --s-imageProfile: 8px;
  --r-imageProfile: 50%;
  padding-bottom: 50px;
}

.capa {
  position: relative;
  background-color: var(--green5);
  padding: var(--p) 0;
  background-image: url('@/assets/bg1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-bottom: solid 4px var(--green5);
}

/* Quando o usuário troca a capa, a bg inline sobrescreve a do CSS */

.btn-edit-capa {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background-color 0.2s;

  & svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.65);
  }
}

.input-hidden {
  display: none;
}

.wrapperImageprofile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: var(--wh-imageProfile);
  height: var(--wh-imageProfile);
  background-color: var(--green5);
  border-radius: var(--r-imageProfile);
  cursor: pointer;

  & img {
    width: calc(var(--wh-imageProfile) - var(--s-imageProfile));
    height: calc(var(--wh-imageProfile) - var(--s-imageProfile));
    border-radius: var(--r-imageProfile);
    border: solid 1px var(--dark1);
    box-shadow: 0 0 43px var(--green6);
    object-fit: cover;
  }

  &:hover .overlay-profile {
    opacity: 1;
  }
}

.overlay-profile {
  position: absolute;
  inset: 4px;
  border-radius: var(--r-imageProfile);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  & svg {
    width: 36px;
    height: 36px;
    color: #fff;
  }
}

.wrapperInputs {
  display: flex;
  flex-direction: column;
  padding: var(--p);
}

.form-control {
  display: flex;
  flex-direction: column;
  --h-input: 42px;

  & label {
    color: var(--green4);
  }

  & .input {
    width: 100%;
    height: var(--h-input);
    font-size: 16px;
    background-color: transparent;
    border: solid 2px transparent;
    border-bottom: solid 2px var(--green6);
    color: var(--white1);
    outline: none;
    border-radius: 6px;
    padding: 0;
  }

  & .input:focus {
    border-bottom: solid 4px var(--green4);
  }
}

.wrapperKeys {
  display: flex;
  flex-direction: column;
  padding: var(--p);

  & p {
    color: var(--green4);
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  & button {
    background-color: var(--green5);
    color: var(--green1);
    height: 40px;
    border: solid 1px var(--green6);
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      transition: background-color ease .4s;
      background-color: var(--green6);
    }

    &:active {
      scale: .95;
    }
  }

  & .keys {
    display: flex;
    flex-direction: column;
    gap: var(--p);
    margin-top: var(--p);
    max-width: calc(var(--w) - var(--p));

    & .private strong {
      color: var(--red2);
    }

    & .public strong {
      color: var(--blue1);
    }

    & .key {
      
      display: flex;
      flex-direction: column;
      max-width: calc(var(--w) - var(--p));

      & b {
        word-break: break-word;
        padding-left: 8px;
        padding-top: 8px;
        padding-bottom: 8px;
      }

      & b:nth-child(2) {
        color: var(--orange1);
      }

      & b:nth-child(1) {
        color: var(--green1);
      }

      & b:nth-child(4) {
        color: var(--green3);
      }

      & span {
        padding-left: 18px;
        font-size: 10px;
        font-family: monospace;
        color: var(--violet4);
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
