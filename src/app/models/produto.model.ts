export class Produto {
    constructor(
      public nome: string,
      public quantidade: number,
      public preco: number,
      public id: string, 
      public categoria?: string,
    ) {
      if (preco < 0) throw new Error('Preço inválido!');
    }
  }
  