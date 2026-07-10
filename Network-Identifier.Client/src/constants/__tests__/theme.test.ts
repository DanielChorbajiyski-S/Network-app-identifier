import { describe, it, expect } from 'vitest';
import { PROTOCOL_COLORS } from '../theme';

describe('PROTOCOL_COLORS', () => {
  it('contains expected protocols', () => {
    expect(PROTOCOL_COLORS).toHaveProperty('TCP');
    expect(PROTOCOL_COLORS).toHaveProperty('UDP');
    expect(PROTOCOL_COLORS).toHaveProperty('ARP');
    expect(PROTOCOL_COLORS).toHaveProperty('IPv4');
    expect(PROTOCOL_COLORS).toHaveProperty('IPv6');
    expect(PROTOCOL_COLORS).toHaveProperty('Other');
  });

  it('maps each protocol to a hex color string', () => {
    Object.values(PROTOCOL_COLORS).forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('has TCP as the darkest indigo shade', () => {
    expect(PROTOCOL_COLORS.TCP).toBe('#312E81');
  });
});
