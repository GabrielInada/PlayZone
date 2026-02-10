export const formatarMilhar = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, '');
  return apenasNumeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};