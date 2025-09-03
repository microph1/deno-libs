import { debug } from './mod.ts';

Deno.test('debug function creation', () => {
  const log = debug('test');
  if (typeof log !== 'function') {
    throw new Error('debug should return a function');
  }
});

Deno.test('debug logs when DEBUG matches namespace', () => {
  Deno.env.set('DEBUG', 'test');
  const log = debug('test');
  // This should log to console if DEBUG is set
  log('Test message');
});

Deno.test('debug does not log when DEBUG does not match', () => {
  Deno.env.set('DEBUG', 'other');
  const log = debug('test');
  // This should not log
  log('Test message');
});