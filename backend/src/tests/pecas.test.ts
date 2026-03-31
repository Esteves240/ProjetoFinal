import { CATEGORIAS_VALIDAS } from '../controllers/pecas.controller';

describe('Validação de Categorias', () => {
  it('deve conter a categoria Motor', () => {
    expect(CATEGORIAS_VALIDAS).toContain('Motor');
  });

  it('deve conter a categoria Suspensão', () => {
    expect(CATEGORIAS_VALIDAS).toContain('Suspensão');
  });

  it('deve ter 8 categorias no total', () => {
    expect(CATEGORIAS_VALIDAS).toHaveLength(9);
  });

  it('não deve conter categorias inválidas', () => {
    expect(CATEGORIAS_VALIDAS).not.toContain('Rodas');
  });
});