/**
 * Debug logging utility inspired by the 'debug' package.
 * Enables namespaced console logging based on DEBUG environment variable.
 */

export function debug(namespace: string) {
  return (message: string, ...args: any[]) => {
    const debugEnv = Deno.env.get('DEBUG');
    if (debugEnv && (debugEnv === '*' || debugEnv.includes(namespace))) {
      console.log(`[${namespace}] ${message}`, ...args);
    }
  };
}