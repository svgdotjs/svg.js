const globals = {
  window, document
}

export default globals

export function registerWindow (w) {
  globals.window = w
  globals.document = w.document
}
