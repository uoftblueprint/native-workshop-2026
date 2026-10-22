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
  const response = await fetch(workshopUrl('/api/lights'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  return readResponse(response);
}

export async function setLightPower(id: string, isOn: boolean): Promise<Light> {
  const response = await fetch(workshopUrl(`/api/lights/${id}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isOn }),
  });

  return readResponse(response);
}

export async function triggerDisco(id: string) {
  const response = await fetch(workshopUrl(`/api/lights/${id}/disco`), {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('The workshop server returned an error.');
  }
}

export async function deleteLight(id: string) {
  const response = await fetch(workshopUrl(`/api/lights/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 404) {
    throw new Error('The workshop server returned an error.');
  }
}
