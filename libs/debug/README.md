# @microphi/debug

A simple debug logging utility for Deno, inspired by the 'debug' package.

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

Or use '*' to enable all:

```bash
DEBUG=* deno run your-script.ts
```