export const slugify = (str: string): string => {
  if (!str) return '';

  return str.toLowerCase()
    .normalize('NFD')  // Decompõe acentos para seus caracteres base
    .replace(/[\u0300-\u036f]/g, '')  // Remove os diacríticos (acentos)
    .replace(/[^a-z0-9 -]/g, '')  // Remove caracteres inválidos, exceto letras, números, espaços e hifens
    .replace(/\s+/g, '-')  // Substitui espaços por hifens
    .replace(/-+/g, '-');  // Remove hifens duplicados
};
