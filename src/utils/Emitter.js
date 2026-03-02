/**
 * Event Bus simples para comunicação entre módulos/componentes.
 * Permite registrar listeners e emitir eventos com argumentos.
 *
 * @example
 * Emitter.on('click', (name) => console.log(name))
 * Emitter.emit('click', 'luposki')
 */
const Emitter = {
  /**
   * Armazena todos os eventos registrados.
   * @type {Record<string, Function[]>}
   */
  events: {},

  /**
   * Registra um listener para um evento.
   *
   * @param {string} event - Nome do evento.
   * @param {(...args: any[]) => void} cb - Callback executado quando o evento for emitido.
   *
   * @example
   * Emitter.on('login', (user) => console.log(user))
   */
  on(event, cb) {
    Emitter.events[event] = Emitter.events[event] || []
    Emitter.events[event].push(cb)
  },

  /**
   * Emite um evento executando todos os listeners registrados.
   *
   * @param {string} event - Nome do evento.
   * @param {...any} args - Argumentos enviados aos listeners.
   *
   * @example
   * Emitter.emit('login', { name: 'Bob' })
   */
  emit(event, ...args) {
    if (!(event in Emitter.events)) return

    Emitter.events[event].forEach((listener) => {
      listener(...args)
    })
  }
}

export { Emitter }

  // Emitter.on('click', (name) => console.log('cliquei', name))
  // Emitter.on('click', () => console.log('cliquei 2'))
  // Emitter.emit('click', "luposki")
  
  
