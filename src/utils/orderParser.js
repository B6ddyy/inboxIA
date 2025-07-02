function extrairNumeroPedido(texto) {
  // Procura padrões como "pedido 123456" ou "#123456"
  const match = texto.match(/(?:pedido\s*#?\s*|#)\d{6,}/i);
  if (match) {
    const num = match[0].replace(/\D/g, '');
    return num;
  }
  return null;
}

module.exports = { extrairNumeroPedido };
