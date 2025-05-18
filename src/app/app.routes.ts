import { Routes } from '@angular/router';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { EstoqueEditarComponent } from './pages/estoque-editar/estoque-editar.component';

export const routes: Routes = [
    {path: 'estoque', component: EstoqueComponent},
    { path: 'cadastro', component: CadastroComponent },
    { path: 'estoque/editar/:id', component: EstoqueEditarComponent },
    { path: '', redirectTo: 'estoque', pathMatch: 'full' }
];
