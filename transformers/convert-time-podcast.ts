import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'convert-time-podcast',
  extensions: ['.md'],
  transform(file) {
    if (file.duration) {
      // Sobescreve o campo duração do podcast para o formato adequado
      const converted = convertToISO8601(file.duration as string);
      if (converted) {
        file.duration = converted;
      }
    }
    return file;
  },
})

/**
 * Converte uma string de tempo (mm:ss ou HH:mm:ss) para o formato de duração ISO 8601 (PT#M#S).
 * @param {string | null | undefined} timeString A string de tempo, por exemplo "23:22" ou "1:05:30".
 * @returns {string | null} A string de duração ISO 8601, ou null se o formato for inválido.
 */
export function convertToISO8601(timeString: string | null | undefined): string | null {
  if (!timeString || typeof timeString !== 'string') {
    return null;
  }

  // Divide a string por ':' e converte para números
  const parts = timeString.split(':').map(Number);
  
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    // Formato HH:mm:ss
    hours = parts[0] || 0;
    minutes = parts[1] || 0;
    seconds = parts[2] || 0;
  } else if (parts.length === 2) {
    // Formato mm:ss
    minutes = parts[0] || 0;
    seconds = parts[1] || 0;
  } else {
    return null;
  }

  // Constrói a string de duração ISO 8601
  let isoString = 'PT';
  if (hours > 0) {
    isoString += `${hours}H`;
  }
  if (minutes > 0) {
    isoString += `${minutes}M`;
  }
  
  // Inclui segundos se for maior que 0, ou se a duração inteira for 0.
  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    isoString += `${seconds}S`;
  }
  
  // Caso de entrada "0:00" ou "0:0", retorna "PT0S"
  if (isoString === 'PT') {
      return 'PT0S';
  }

  return isoString;
}
