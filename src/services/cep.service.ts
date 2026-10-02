export interface CepResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const cepService = {
  async lookup(cep: string): Promise<CepResult | null> {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.erro) return null;
      return data;
    } catch {
      return null;
    }
  },
};
