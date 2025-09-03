# @microphi/debug

A simple debug logging utility for Deno, inspired by the 'debug' package. Features colored output, timestamps, regex namespace matching, and callback support.

## Usage

```ts
import { debug } from '@microphi/debug';

const log = debug('myapp');
log('This is a debug message');
```

Set the DEBUG environment variable to enable logging:

```bash
DEBUG=myapp deno run your-script.ts
```

Use comma-separated namespaces or regex patterns:

```bash
DEBUG=myapp,other deno run your-script.ts
DEBUG=my.* deno run your-script.ts  # Regex support
```

Or use '*' to enable all:

```bash
DEBUG=* deno run your-script.ts
```

## Callbacks

Register callbacks to handle log messages:

```ts
import { onMessage } from '@microphi/debug';

onMessage(({ formattedTime, namespace, args }) => {
  // Custom handling
  console.log(`Custom: ${formattedTime} [${namespace}]`, ...args);
});
```