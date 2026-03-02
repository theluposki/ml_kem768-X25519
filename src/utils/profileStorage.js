const STORAGE_KEY = 'myUserProfile'

/**
 * Salva os dados do perfil no localStorage.
 * @param {Object} profileData
 */
export function saveProfile(profileData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData))
  } catch (e) {
    console.error('Erro ao salvar perfil no localStorage:', e)
  }
}

/**
 * Carrega os dados do perfil do localStorage.
 * @returns {Object|null}
 */
export function loadProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Erro ao carregar perfil do localStorage:', e)
    return null
  }
}

/**
 * Remove os dados do perfil do localStorage.
 */
export function clearProfile() {
  localStorage.removeItem(STORAGE_KEY)
}
