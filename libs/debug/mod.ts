/**
 * Debug logging utility inspired by the 'debug' package.
 * Enables namespaced console logging based on DEBUG environment variable.
 */


const colors = new Map<string, string>();

const colorPalette: string[] = [];


colorPalette.push(
  '#0000FF', '#6699FF', // Blue
  '#FF0000', '#FF6666', // Red
  '#00FF00', '#66FF66', // Green
  '#FFFF00', '#FFFF66', // Yellow
  '#800080', '#CC66CC', // Purple
  '#FFA500', '#FFCC99', // Orange
  '#FFC0CB', '#FFCCCC', // Pink
  '#40E0D0', '#66CCCC'  // Turquoise
);

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


  const random = Math.floor(Math.random() * colorPalette.length);
  // Generate a random color
  const randomColor = colors.get(namespace) ||
    colors.set(namespace, colorPalette[random]).get(namespace) as string;


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
