/**
 * Debug logging utility inspired by the 'debug' package.
 * Enables namespaced console logging based on DEBUG environment variable.
 */


const colors = new Map<string, string>();

/**
 * Converts HSL to RGB.
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 1/6) { r = c; g = x; b = 0; }
  else if (1/6 <= h && h < 2/6) { r = x; g = c; b = 0; }
  else if (2/6 <= h && h < 3/6) { r = 0; g = c; b = x; }
  else if (3/6 <= h && h < 4/6) { r = 0; g = x; b = c; }
  else if (4/6 <= h && h < 5/6) { r = x; g = 0; b = c; }
  else if (5/6 <= h && h < 1) { r = c; g = 0; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/**
 * Converts RGB to hex.
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generator for high-contrast colors.
 */
function* highContrastColorGenerator(): Generator<string> {
  let lastHue = Math.random() * 360;
  while (true) {
    const minHueDiff = 120;
    let newHue = (lastHue + minHueDiff + Math.random() * (360 - 2 * minHueDiff)) % 360;
    lastHue = newHue;
    const saturation = 70 + Math.random() * 30; // 70-100%
    const lightness = 40 + Math.random() * 30;  // 40-70%
    const [r, g, b] = hslToRgb(newHue, saturation, lightness);
    yield rgbToHex(r, g, b);
  }
}

// Singleton generator instance
const colorGen = highContrastColorGenerator();

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


  // Generate a high-contrast color
  const randomColor = colors.get(namespace) ||
    colors.set(namespace, colorGen.next().value).get(namespace) as string;


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
