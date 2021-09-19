import fetch from 'node-fetch';

export async function categorize(query) {
  const url = process.env.AZURE_URL + query;

  const resp = await fetch(url);

  const json = await resp.json()

  return json;
}
