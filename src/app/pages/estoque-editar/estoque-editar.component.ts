import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Produto } from '../../models/produto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estoque-editar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque-editar.component.html',
  styleUrls: ['./estoque-editar.component.scss']
})
export class EstoqueEditarComponent implements OnInit {
  produto: Produto | null = null;

  carregando = true;
  salvando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getProdutoById(id).subscribe({
        next: (produto) => {
          this.produto = produto;
          this.carregando = false;
        },
        error: () => {
          this.mensagemErro = 'Produto não encontrado.';
          this.carregando = false;
          setTimeout(() => this.router.navigate(['/estoque']), 3000);
        }
      });
    }
  }

  salvar() {
    if (this.produto) {
      this.salvando = true;
      this.apiService.updateProduto(this.produto.id!, this.produto).subscribe({
        next: () => {
          this.mensagemSucesso = 'Produto atualizado com sucesso!';
          this.salvando = false;
          setTimeout(() => this.router.navigate(['/estoque']), 2000);
        },
        error: () => {
          this.mensagemErro = 'Erro ao atualizar produto.';
          this.salvando = false;
          setTimeout(() => (this.mensagemErro = ''), 3000);
        }
      });
    }
  }

  irParaEstoque() {
    this.router.navigate(['/estoque']);
  }
}
