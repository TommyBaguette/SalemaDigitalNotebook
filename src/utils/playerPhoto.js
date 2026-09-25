const PHOTO_EXT = 'jpeg';

export function slug(nome) {
  return String(nome)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function photoUrl(nome) {
  return `${import.meta.env.BASE_URL}players/${slug(nome)}.${PHOTO_EXT}`;
}

export function formatScore(v) {
  const n = Number(v).toFixed(2);
  return v > 0 ? `+${n}` : n;
}
