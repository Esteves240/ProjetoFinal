describe('Lógica de Stock', () => {
  it('quantidade 0 deve tornar item indisponível', () => {
    const quantidade = 0;
    const disponivel = quantidade > 0;
    expect(disponivel).toBe(false);
  });

  it('quantidade positiva deve manter item disponível', () => {
    const quantidade = 3;
    const disponivel = quantidade > 0;
    expect(disponivel).toBe(true);
  });

  it('quantidade negativa não deve ser permitida', () => {
    const quantidade = -1;
    const valido = quantidade >= 0;
    expect(valido).toBe(false);
  });
});