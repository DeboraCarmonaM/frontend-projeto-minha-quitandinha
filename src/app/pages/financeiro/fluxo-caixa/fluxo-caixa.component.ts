import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { Lancamento, TipoLancamento, CategoriaFinanceira } from '../../../models/lancamento.model';

registerLocaleData(localePt);

interface ResumoCategoria {
  nome: string;
  tipo: TipoLancamento;
  total: number;
  quantidade: number;
  percentual: number;
}

interface ResumoMensal {
  chave: string;
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
  percentualReceitas: number;
  percentualDespesas: number;
  percentualSaldo: number;
}

@Component({
  selector: 'app-fluxo-caixa',
  templateUrl: './fluxo-caixa.component.html',
  styleUrls: ['./fluxo-caixa.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [DatePipe]
})
export class FluxoCaixaComponent implements OnInit {
  categorias: CategoriaFinanceira[] = [
    { id: 1, nome: 'Aluguel/Imoveis' },
    { id: 2, nome: 'Estoque/Compras' },
    { id: 3, nome: 'Manutencao/Servicos' },
    { id: 4, nome: 'Vendas - Cartao' },
    { id: 5, nome: 'Vendas - Dinheiro/Pix' },
  ];

  lancamentosParaTabela: Lancamento[] = [
    {
      id: 6,
      data: '2026-01-08',
      descricao: 'Vendas diarias (Dinheiro/Pix)',
      categoriaId: 5,
      tipo: 'RECEITA',
      valor: 5000.00
    },
    {
      id: 7,
      data: '2026-02-14',
      descricao: 'Recebimento Vendas Cartao (D+2)',
      categoriaId: 4,
      tipo: 'RECEITA',
      valor: 7500.00
    },
    {
      id: 8,
      data: '2026-05-10',
      descricao: 'Vendas diarias complementares',
      categoriaId: 5,
      tipo: 'RECEITA',
      valor: 2500.00
    },
    {
      id: 1,
      data: '2026-01-05',
      descricao: 'Aluguel do Escritorio',
      categoriaId: 1,
      tipo: 'DESPESA',
      valor: 3500.00
    },
    {
      id: 2,
      data: '2026-02-03',
      descricao: 'Compra de Mercadoria - Lote A',
      categoriaId: 2,
      tipo: 'DESPESA',
      valor: 2150.00
    },
    {
      id: 3,
      data: '2026-03-18',
      descricao: 'Manutencao de Equipamentos',
      categoriaId: 3,
      tipo: 'DESPESA',
      valor: 750.00
    },
    {
      id: 4,
      data: '2026-04-22',
      descricao: 'Compra de Mercadoria - Lote B',
      categoriaId: 2,
      tipo: 'DESPESA',
      valor: 1000.00
    },
    {
      id: 5,
      data: '2026-05-06',
      descricao: 'Servicos de Limpeza e Manutencao',
      categoriaId: 3,
      tipo: 'DESPESA',
      valor: 495.00
    }
  ];

  lancamentos: Lancamento[] = [];

  dataInicial: string;
  dataFinal: string;
  filtroTipo: 'TODOS' | TipoLancamento = 'TODOS';

  totalReceitas = 0;
  totalDespesas = 0;
  saldoAtual = 0;
  quantidadeReceitas = 0;
  quantidadeDespesas = 0;
  quantidadeLancamentos = 0;
  mediaReceitas = 0;
  mediaDespesas = 0;
  percentualDespesasSobreReceitas = 0;
  resumoCategorias: ResumoCategoria[] = [];
  resumoMensal: ResumoMensal[] = [];

  novoLancamento: Partial<Omit<Lancamento, 'id'>> = {};

  constructor(private datePipe: DatePipe) {
    const datas = this.lancamentosParaTabela.map(lancamento => lancamento.data).sort();
    this.dataInicial = datas[0] || this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    this.dataFinal = datas[datas.length - 1] || this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.aplicarFiltros();
    this.inicializarNovoLancamento();
  }

  inicializarNovoLancamento(): void {
    this.novoLancamento = {
      data: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '',
      tipo: 'DESPESA',
      valor: 0,
      descricao: '',
      categoriaId: undefined
    };
  }

  getNomeCategoria(id: number | undefined): string {
    if (!id) return 'Nao Classificado';
    return this.categorias.find(categoria => categoria.id === id)?.nome || 'Categoria Desconhecida';
  }

  carregarLancamentos(): void {
    if (!this.dataInicial || !this.dataFinal) {
      alert('Selecione um periodo valido.');
      return;
    }

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.lancamentos = this.lancamentosParaTabela.filter(lancamento => {
      const estaNoPeriodo = lancamento.data >= this.dataInicial && lancamento.data <= this.dataFinal;
      const atendeTipo = this.filtroTipo === 'TODOS' || lancamento.tipo === this.filtroTipo;

      return estaNoPeriodo && atendeTipo;
    });

    this.calcularTotais();
  }

  mudarFiltroTipo(): void {
    this.aplicarFiltros();
  }

  calcularTotais(): void {
    this.totalReceitas = 0;
    this.totalDespesas = 0;
    this.quantidadeReceitas = 0;
    this.quantidadeDespesas = 0;
    this.quantidadeLancamentos = this.lancamentos.length;

    this.lancamentos.forEach(lancamento => {
      const valor = Math.abs(lancamento.valor);

      if (lancamento.tipo === 'RECEITA') {
        this.totalReceitas += valor;
        this.quantidadeReceitas++;
      } else {
        this.totalDespesas += valor;
        this.quantidadeDespesas++;
      }
    });

    this.saldoAtual = this.totalReceitas - this.totalDespesas;
    this.mediaReceitas = this.quantidadeReceitas ? this.totalReceitas / this.quantidadeReceitas : 0;
    this.mediaDespesas = this.quantidadeDespesas ? this.totalDespesas / this.quantidadeDespesas : 0;
    this.percentualDespesasSobreReceitas = this.totalReceitas
      ? (this.totalDespesas / this.totalReceitas) * 100
      : 0;
    this.resumoCategorias = this.calcularResumoCategorias();
    this.resumoMensal = this.calcularResumoMensal();
  }

  calcularResumoCategorias(): ResumoCategoria[] {
    const resumo = new Map<string, ResumoCategoria>();

    this.lancamentos.forEach(lancamento => {
      const nome = this.getNomeCategoria(lancamento.categoriaId);
      const chave = `${lancamento.tipo}-${nome}`;
      const valor = Math.abs(lancamento.valor);
      const totalGeralTipo = lancamento.tipo === 'RECEITA' ? this.totalReceitas : this.totalDespesas;
      const item = resumo.get(chave) || {
        nome,
        tipo: lancamento.tipo,
        total: 0,
        quantidade: 0,
        percentual: 0
      };

      item.total += valor;
      item.quantidade++;
      item.percentual = totalGeralTipo ? (item.total / totalGeralTipo) * 100 : 0;
      resumo.set(chave, item);
    });

    return Array.from(resumo.values()).sort((a, b) => b.total - a.total);
  }

  calcularResumoMensal(): ResumoMensal[] {
    const resumo = new Map<string, ResumoMensal>();

    this.lancamentos.forEach(lancamento => {
      const chave = lancamento.data.slice(0, 7);
      const item = resumo.get(chave) || {
        chave,
        mes: this.formatarMes(chave),
        receitas: 0,
        despesas: 0,
        saldo: 0,
        percentualReceitas: 0,
        percentualDespesas: 0,
        percentualSaldo: 0
      };
      const valor = Math.abs(lancamento.valor);

      if (lancamento.tipo === 'RECEITA') {
        item.receitas += valor;
      } else {
        item.despesas += valor;
      }

      item.saldo = item.receitas - item.despesas;
      resumo.set(chave, item);
    });

    const meses = Array.from(resumo.values()).sort((a, b) => a.chave.localeCompare(b.chave));
    const maiorValor = Math.max(
      ...meses.flatMap(mes => [mes.receitas, mes.despesas, Math.abs(mes.saldo)]),
      1
    );

    return meses.map(mes => ({
      ...mes,
      percentualReceitas: (mes.receitas / maiorValor) * 100,
      percentualDespesas: (mes.despesas / maiorValor) * 100,
      percentualSaldo: (Math.abs(mes.saldo) / maiorValor) * 100
    }));
  }

  formatarMes(chave: string): string {
    const [ano, mes] = chave.split('-').map(Number);
    const data = new Date(ano, mes - 1, 1);
    return this.datePipe.transform(data, 'MMM/yy', undefined, 'pt-BR') || chave;
  }

  salvarLancamentoManual(): void {
    if (!this.novoLancamento.data || !this.novoLancamento.valor || !this.novoLancamento.descricao || !this.novoLancamento.categoriaId) {
      alert('Preencha todos os campos da despesa.');
      return;
    }

    const proximoId = Math.max(...this.lancamentosParaTabela.map(lancamento => lancamento.id), 0) + 1;
    const lancamento: Lancamento = {
      id: proximoId,
      data: this.novoLancamento.data,
      descricao: this.novoLancamento.descricao,
      categoriaId: this.novoLancamento.categoriaId,
      tipo: 'DESPESA',
      valor: Math.abs(Number(this.novoLancamento.valor))
    };

    this.lancamentosParaTabela = [...this.lancamentosParaTabela, lancamento];
    this.inicializarNovoLancamento();
    this.aplicarFiltros();
  }
}
