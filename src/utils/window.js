export const globals = {
  window: typeof window === 'undefined' ? null : window,
  document: typeof document === 'undefined' ? null : document
}

export function registerWindow (win = null, doc = null) {
  globals.window = win
  globals.document = doc
}
