import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  produto: Produto = new Produto('', 0, 0, '');

  constructor(private apiService: ApiService) {}

  cadastrarProduto(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched(); // Mostra os erros caso tenha
      return;
    }

    if (!this.produto.nome || this.produto.preco < 0 || this.produto.quantidade < 0) {
      alert('Preencha os dados corretamente!');
      return;
    }

    this.apiService.addProduto(this.produto).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        this.produto = new Produto('', 0, 0, ''); // Limpa o formulário
      },
      error: () => {
        alert('Erro ao cadastrar produto.');
      }
    });
  }
}
