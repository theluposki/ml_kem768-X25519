/**
 * Converte um File ou Blob para uma string Base64.
 * @param {File|Blob} file
 * @returns {Promise<string>} data URL em base64 (ex: "data:image/png;base64,...")
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Erro ao converter imagem para Base64'))
    reader.readAsDataURL(file)
  })
}
