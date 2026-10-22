import { LIGHTBOX_API_URL } from '../../config/workshop';

export type Light = {
  id: string;
  name: string;
  isOn: boolean;
};

export function workshopUrl(path: string) {
  const base = LIGHTBOX_API_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

export async function readResponse(response: Response): Promise<Light> {
  if (!response.ok) {
    throw new Error('The workshop server returned an error.');
  }

  const data = (await response.json()) as Light;
  return data;
}

export async function createLight(name: string): Promise<Light> {
  // TODO LIGHTS 1
  // Create a light on the workshop server and return it.
  //
  // Hints:
  // - fetch can send a POST. workshopUrl('/api/lights') is the address.
  // - Set Content-Type to application/json and send JSON.stringify({ name }).
  // - Pass the response to readResponse. It checks the status and returns the light.
  throw new Error('TODO LIGHTS 1 has not been implemented yet.');
}

export async function setLightPower(id: string, isOn: boolean): Promise<Light> {
  // TODO LIGHTS 2
  // Update one light and return the result.
  //
  // Hints:
  // - This request uses PATCH.
  // - The path is /api/lights/ plus the id. workshopUrl can build it.
  // - The JSON body is { isOn }. readResponse parses the light.
  throw new Error('TODO LIGHTS 2 has not been implemented yet.');
}

export async function triggerDisco(id: string) {
  const response = await fetch(workshopUrl(`/api/lights/${id}/disco`), {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('The workshop server returned an error.');
  }
}
