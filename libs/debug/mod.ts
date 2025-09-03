/**
 * Debug logging utility inspired by the 'debug' package.
 * Enables namespaced console logging based on DEBUG environment variable.
 */


const colors = new Map<string, string>();

/**
 * Generates a random hex color.
 */
function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export type Log = (...args: unknown[]) => void;

export type onMessageCallback = ({
  formattedTime, namespace, args
}: {formattedTime: string; namespace: string; args: unknown[]}) => void;

const callBacks: onMessageCallback[] = [];

export function onMessage(cb: onMessageCallback) {
  callBacks.push(cb);
}

export function debug(namespace: string): Log {


  let lastTimeStamp = 0;
  const DEBUG = Deno.env.get('DEBUG');


  // Generate a random color
  const randomColor = colors.get(namespace) ||
    colors.set(namespace, generateRandomColor()).get(namespace) as string;


  // CSS style for the namespace with random color and bold
  const namespaceStyle = `color: ${randomColor}; font-weight: bold;`;

  return (...args: unknown[]) => {

    let formattedTime = '';
    const now = Date.now();

    if ((now - lastTimeStamp) > 1000) {

      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const seconds = currentTime.getSeconds().toString().padStart(2, '0');

      formattedTime = `${hours}:${minutes}:${seconds}`;
      lastTimeStamp = now;

    } else {
      formattedTime = `+${now - lastTimeStamp}`.padStart(8, ' ');
    }


    if (DEBUG) {

      const regexs = DEBUG.split(',');
      for (const regex of regexs) {

        const match = regex === '*' ? true : namespace.match(regex);

        if (match) {
          // Print formatted time with namespace
          console.log(`%c${formattedTime} %c${namespace}`, 'color: lightblue', namespaceStyle, ...args);

        }

        // in anycase call callbacks
        callBacks.forEach((cb) => {
          cb.apply(null, [{ formattedTime, namespace, args }]);
        });

      }

    }
  };
}
