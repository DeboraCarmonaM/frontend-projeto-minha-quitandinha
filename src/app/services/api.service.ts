import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../models/produto.model';
import { Observable, Subject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface DbLocal {
  produtos: Produto[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly storageKey = 'minha-quitandinha-produtos';
  private readonly dbLocalUrl = 'assets/db.json';

  private produtosAtualizadosSubject = new Subject<Produto[]>();
  produtosAtualizados$ = this.produtosAtualizadosSubject.asObservable();

  constructor(private http: HttpClient) { }

  getProdutos(): Observable<Produto[]> {
    const produtosSalvos = this.lerProdutosSalvos();

    if (produtosSalvos) {
      return of(produtosSalvos);
    }

    return this.http.get<DbLocal>(this.dbLocalUrl).pipe(
      map(db => db.produtos || []),
      tap(produtos => this.salvarProdutos(produtos))
    );
  }

  addProduto(produto: Produto): Observable<Produto> {
    return this.getProdutos().pipe(
      map(produtos => {
        const novoProduto = {
          ...produto,
          id: produto.id || this.gerarId()
        };
        const produtosAtualizados = [...produtos, novoProduto];

        this.salvarProdutos(produtosAtualizados);
        this.produtosAtualizadosSubject.next(produtosAtualizados);

        return novoProduto;
      })
    );
  }

  getProdutoById(id: string): Observable<Produto> {
    return this.getProdutos().pipe(
      map(produtos => {
        const produto = produtos.find(item => item.id === id);

        if (!produto) {
          throw new Error('Produto nao encontrado.');
        }

        return produto;
      })
    );
  }

  updateProduto(id: string, produto: Produto): Observable<Produto> {
    return this.getProdutos().pipe(
      map(produtos => {
        const existeProduto = produtos.some(item => item.id === id);

        if (!existeProduto) {
          throw new Error('Produto nao encontrado.');
        }

        const produtoAtualizado = { ...produto, id };
        const produtosAtualizados = produtos.map(item => item.id === id ? produtoAtualizado : item);

        this.salvarProdutos(produtosAtualizados);
        this.produtosAtualizadosSubject.next(produtosAtualizados);

        return produtoAtualizado;
      })
    );
  }

  deleteProduto(id: string): Observable<void> {
    return this.getProdutos().pipe(
      map(produtos => {
        const produtosAtualizados = produtos.filter(produto => produto.id !== id);

        this.salvarProdutos(produtosAtualizados);
        this.produtosAtualizadosSubject.next(produtosAtualizados);
      })
    );
  }

  private lerProdutosSalvos(): Produto[] | null {
    const produtos = localStorage.getItem(this.storageKey);
    return produtos ? JSON.parse(produtos) as Produto[] : null;
  }

  private salvarProdutos(produtos: Produto[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(produtos));
  }

  private gerarId(): string {
    return Math.random().toString(36).slice(2, 8);
  }
}
