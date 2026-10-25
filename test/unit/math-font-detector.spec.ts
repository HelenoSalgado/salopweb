import { describe, it, expect } from 'vitest';
import { containsMathNode } from '../../transformers/math-font-detector';

describe('containsMathNode', () => {
  it('detects math in standard HAST AST object format', () => {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'element',
          tag: 'p',
          children: [
            {
              type: 'element',
              tag: 'math',
              children: []
            }
          ]
        }
      ]
    };
    expect(containsMathNode(ast)).toBe(true);
  });

  it('detects math in Minimark array format', () => {
    const minimark = [
      'div',
      {},
      [
        'p',
        {},
        ['math', { display: 'block' }, ['mrow', {}, 'E=mc^2']]
      ]
    ];
    expect(containsMathNode(minimark)).toBe(true);
  });

  it('returns false when no math node is present', () => {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'element',
          tag: 'p',
          children: [{ type: 'text', value: 'Texto comum sem matemática' }]
        }
      ]
    };
    expect(containsMathNode(ast)).toBe(false);
    expect(containsMathNode(null)).toBe(false);
    expect(containsMathNode(undefined)).toBe(false);
    expect(containsMathNode(['div', {}, ['p', {}, 'Apenas texto']])).toBe(false);
  });
});
