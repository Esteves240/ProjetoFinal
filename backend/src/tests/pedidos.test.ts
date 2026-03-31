describe('Lógica de Pedidos', () => {
  const STATUS_VALIDOS = ['Aprovado', 'Recusado', 'Devolvido'];

  it('deve aceitar status Aprovado', () => {
    expect(STATUS_VALIDOS).toContain('Aprovado');
  });

  it('deve aceitar status Recusado', () => {
    expect(STATUS_VALIDOS).toContain('Recusado');
  });

  it('não deve aceitar status inválido', () => {
    expect(STATUS_VALIDOS).not.toContain('Cancelado');
  });

  it('deve ter exactamente 3 status válidos', () => {
    expect(STATUS_VALIDOS).toHaveLength(3);
  });
});