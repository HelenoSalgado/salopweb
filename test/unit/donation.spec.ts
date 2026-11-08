import { describe, it, expect } from 'vitest';
import { DONATION_CONFIG } from '../../app/data/donation';
import fs from 'node:fs';
import path from 'node:path';

describe('Donation Configuration & Assets', () => {
  it('should have valid donation config fields', () => {
    expect(DONATION_CONFIG).toBeDefined();
    expect(DONATION_CONFIG.title).toBe('Apoiar o Trabalho');
    expect(DONATION_CONFIG.pixKey).toBe('contato@heleno.dev');
    expect(DONATION_CONFIG.recipientName).toBe('Heleno Salgado');
    expect(DONATION_CONFIG.pixKey).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should have valid Pix Copia e Cola payload structure', () => {
    const payload = DONATION_CONFIG.pixCopiaECola;
    expect(payload).toBeDefined();
    // EMVCo format begins with 000201
    expect(payload.startsWith('000201')).toBe(true);
    // Contains merchant account GUI
    expect(payload).toContain('br.gov.bcb.pix');
    // Contains the recipient pix key
    expect(payload).toContain('contato@heleno.dev');
    // Contains currency 986 (BRL) and country BR
    expect(payload).toContain('5303986');
    expect(payload).toContain('5802BR');
    // Ends with 4-character CRC16
    expect(payload).toMatch(/6304[0-9A-F]{4}$/);
  });

  it('should have the QR Code SVG file present in public/images', () => {
    const qrCodePath = path.resolve(process.cwd(), 'public' + DONATION_CONFIG.qrCodeImage);
    expect(fs.existsSync(qrCodePath)).toBe(true);
    const content = fs.readFileSync(qrCodePath, 'utf-8');
    expect(content).toContain('<svg');
    expect(content).toContain('</svg>');
  });

  it('should have the isolated apoiar.js script present in public/js', () => {
    const scriptPath = path.resolve(process.cwd(), 'public/js/apoiar.js');
    expect(fs.existsSync(scriptPath)).toBe(true);
    const content = fs.readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('copyToClipboard');
    expect(content).toContain('showCopyFeedback');
  });
});
