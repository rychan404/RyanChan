import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WEB3FORMS_ENDPOINT, submitContactForm } from './contact';

const payload = { name: 'Ada', email: 'ada@example.com', message: 'Hello' };

beforeEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('submitContactForm', () => {
  it('throws a clear error when the access key is not configured', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', '');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    await expect(submitContactForm(payload)).rejects.toThrow(/not configured/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('posts JSON to Web3Forms with the key and the three fields', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', 'test-key');
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'ok' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    await expect(submitContactForm(payload)).resolves.toBeUndefined();

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe(WEB3FORMS_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body)).toEqual({
      access_key: 'test-key',
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello',
    });
  });

  it('throws when Web3Forms reports failure in the body', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, message: 'Invalid access key' }),
    }));
    await expect(submitContactForm(payload)).rejects.toThrow('Invalid access key');
  });

  it('throws on a non-2xx response', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 500, statusText: 'Server Error',
      json: async () => ({}),
    }));
    await expect(submitContactForm(payload)).rejects.toThrow(/500/);
  });

  it('surfaces a network failure', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(submitContactForm(payload)).rejects.toThrow(/Failed to fetch/);
  });
});
