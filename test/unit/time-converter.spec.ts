import { describe, it, expect } from 'vitest';
import { convertToISO8601 } from '../../transformers/convert-time-podcast';

describe('convertToISO8601 utility', () => {
  it('converts mm:ss format to ISO 8601 duration', () => {
    expect(convertToISO8601('23:22')).toBe('PT23M22S');
    expect(convertToISO8601('05:10')).toBe('PT5M10S');
    expect(convertToISO8601('0:45')).toBe('PT45S');
  });

  it('converts HH:mm:ss format to ISO 8601 duration', () => {
    expect(convertToISO8601('1:05:30')).toBe('PT1H5M30S');
    expect(convertToISO8601('02:15:00')).toBe('PT2H15M');
    expect(convertToISO8601('1:00:00')).toBe('PT1H');
  });

  it('handles zero duration correctly', () => {
    expect(convertToISO8601('0:00')).toBe('PT0S');
    expect(convertToISO8601('00:00:00')).toBe('PT0S');
  });

  it('returns null for invalid or empty inputs', () => {
    expect(convertToISO8601('')).toBeNull();
    expect(convertToISO8601(null)).toBeNull();
    expect(convertToISO8601(undefined)).toBeNull();
    expect(convertToISO8601('invalido')).toBeNull();
    expect(convertToISO8601('1:2:3:4')).toBeNull();
  });
});
