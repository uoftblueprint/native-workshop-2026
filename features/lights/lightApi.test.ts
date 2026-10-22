import { createLight, deleteLight, setLightPower } from './lightApi';

function check(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : '';
}

function headerValue(headers: unknown, name: string) {
  if (!headers) return '';

  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    return headers.get(name) ?? '';
  }

  if (Array.isArray(headers)) {
    const found = headers.find(
      (entry) => Array.isArray(entry) && String(entry[0]).toLowerCase() === name.toLowerCase(),
    );
    return found ? String(found[1]) : '';
  }

  if (typeof headers === 'object') {
    const record = headers as Record<string, unknown>;
    const key = Object.keys(record).find((item) => item.toLowerCase() === name.toLowerCase());
    return key ? String(record[key]) : '';
  }

  return '';
}

function requestParts(mock: jest.Mock) {
  const call = mock.mock.calls[0] as [unknown, { method?: string; headers?: unknown; body?: unknown }?] | undefined;
  if (!call) {
    throw new Error('The function should call fetch.');
  }

  const url = String(call[0]);
  const options = call[1];
  if (!options) {
    throw new Error('Pass an options object to fetch with the method, headers, and body.');
  }

  return { url, options };
}

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('createLight', () => {
  it('sends the name as JSON and returns the light', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({ id: 'light-1', name: 'Bedroom Lamp', isOn: false }),
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    let light: Awaited<ReturnType<typeof createLight>> | undefined;
    try {
      light = await createLight('Bedroom Lamp');
    } catch (error) {
      if (messageOf(error).includes('has not been implemented yet')) {
        throw new Error(
          'createLight still has the placeholder. Send a POST request and return the light from the response.',
        );
      }
      throw error;
    }

    const { url, options } = requestParts(fetchMock);
    check(/\/api\/lights\/?$/.test(url), 'createLight should POST to /api/lights.');
    check(options.method?.toUpperCase() === 'POST', 'createLight should send a POST request.');
    check(
      headerValue(options.headers, 'Content-Type').includes('application/json'),
      'Send JSON. Set the Content-Type header to application/json.',
    );

    let body: { name?: string };
    try {
      body = JSON.parse(String(options.body)) as { name?: string };
    } catch {
      throw new Error('The body should be a JSON string. JSON.stringify does that.');
    }

    check(body.name === 'Bedroom Lamp', 'The JSON body should be { name } using the name you were given.');
    check(light?.id === 'light-1', 'createLight should return the light from the response, including its id.');
    check(light?.name === 'Bedroom Lamp', 'createLight should return the light name from the response.');
  });

  it('throws when the server responds with an error', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ message: 'nope' }),
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    let threw = false;
    try {
      await createLight('Bedroom Lamp');
    } catch (error) {
      threw = true;
      if (messageOf(error).includes('has not been implemented yet')) {
        throw new Error('createLight still has the placeholder. Call fetch, and throw if the response is not ok.');
      }
    }

    check(fetchMock.mock.calls.length === 1, 'createLight should call fetch before deciding the request failed.');
    check(
      threw,
      'If the server responds with an error, createLight should throw instead of returning that body.',
    );
  });
});

describe('setLightPower', () => {
  it('sends a PATCH for that light and returns the updated light', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({ id: 'light-7', name: 'Bedroom Lamp', isOn: true }),
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    let light: Awaited<ReturnType<typeof setLightPower>> | undefined;
    try {
      light = await setLightPower('light-7', true);
    } catch (error) {
      if (messageOf(error).includes('has not been implemented yet')) {
        throw new Error(
          'setLightPower still has the placeholder. Send a PATCH request and return the updated light.',
        );
      }
      throw error;
    }

    const { url, options } = requestParts(fetchMock);
    check(url.includes('/api/lights/light-7'), 'setLightPower should request /api/lights/ plus the light id.');
    check(!url.includes('/disco'), 'setLightPower updates the light. It should not call the disco path.');
    check(options.method?.toUpperCase() === 'PATCH', 'setLightPower should send a PATCH request.');
    check(
      headerValue(options.headers, 'Content-Type').includes('application/json'),
      'Send JSON. Set the Content-Type header to application/json.',
    );

    let body: { isOn?: boolean };
    try {
      body = JSON.parse(String(options.body)) as { isOn?: boolean };
    } catch {
      throw new Error('The body should be a JSON string. JSON.stringify does that.');
    }

    check(body.isOn === true, 'The JSON body should be { isOn } with the value you were given.');
    check(light?.id === 'light-7', 'setLightPower should return the light from the response.');
    check(light?.isOn === true, 'setLightPower should return the updated isOn value.');
  });

  it('can turn a light off', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({ id: 'light-7', name: 'Bedroom Lamp', isOn: false }),
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    let light: Awaited<ReturnType<typeof setLightPower>> | undefined;
    try {
      light = await setLightPower('light-7', false);
    } catch (error) {
      if (messageOf(error).includes('has not been implemented yet')) {
        throw new Error('setLightPower still has the placeholder. The body should send the isOn value it was given.');
      }
      throw error;
    }

    const { options } = requestParts(fetchMock);
    let body: { isOn?: boolean };
    try {
      body = JSON.parse(String(options.body)) as { isOn?: boolean };
    } catch {
      throw new Error('The body should be a JSON string. JSON.stringify does that.');
    }

    check(body.isOn === false, 'Turning a light off should send { isOn: false }, not a hardcoded true.');
    check(light?.isOn === false, 'setLightPower should return the light from the response when it turns off.');
  });
});

describe('deleteLight', () => {
  it('sends DELETE for that light', async () => {
    const fetchMock = jest.fn(async () => ({ ok: true, status: 204 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await deleteLight('light-7');

    const { url, options } = requestParts(fetchMock);
    check(url.includes('/api/lights/light-7'), 'deleteLight should request /api/lights/ plus the light id.');
    check(!url.includes('/disco'), 'deleteLight removes the light. It should not call the disco path.');
    check(options.method?.toUpperCase() === 'DELETE', 'deleteLight should send a DELETE request.');
  });

  it('treats a missing light as already removed', async () => {
    const fetchMock = jest.fn(async () => ({ ok: false, status: 404 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await deleteLight('light-7');
    check(fetchMock.mock.calls.length === 1, 'deleteLight should call fetch once.');
  });

  it('throws when the server responds with an error', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 500 })) as unknown as typeof fetch;

    let threw = false;
    try {
      await deleteLight('light-7');
    } catch {
      threw = true;
    }

    check(threw, 'If the server responds with an error, deleteLight should throw.');
  });
});
