import { defineTransformer } from '@nuxt/content';

/**
 * Detecta se a árvore de conteúdo AST contém nós de expressões matemáticas (MathML <math>).
 * Suporta tanto o formato Minimark compactado (arrays) quanto a árvore HAST padrão de objetos.
 */
export const containsMathNode = (node: unknown): boolean => {
  if (!node) return false;

  // Formato Minimark (array onde o primeiro elemento é o nome da tag)
  if (Array.isArray(node)) {
    if (typeof node[0] === 'string' && (node[0] === 'math' || node[0] === 'mathlm')) {
      return true;
    }
    return node.some(child => containsMathNode(child));
  }

  // Formato de objeto AST (HAST / MDC)
  if (typeof node === 'object') {
    const record = node as Record<string, unknown>;
    if (record.tag === 'math' || record.tag === 'mathlm' || record.type === 'math' || record.type === 'inlineMath') {
      return true;
    }
    if (Array.isArray(record.children)) {
      return record.children.some(child => containsMathNode(child));
    }
    if (Array.isArray(record.value)) {
      return record.value.some(child => containsMathNode(child));
    }
  }

  return false;
};

export default defineTransformer({
  name: 'math-font-detector',
  extensions: ['.md'],
  transform(file) {
    if (file.mathfont === true) {
      return file;
    }

    if (file.body && containsMathNode(file.body)) {
      file.mathfont = true;
    }

    return file;
  },
});
