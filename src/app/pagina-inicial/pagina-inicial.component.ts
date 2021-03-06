import { Component, OnInit } from '@angular/core';
import { PessoaService } from '../service/pessoa.service';
import { Pessoa, InfoAdicionais, Curriculo, Formacao, Trabalho, Notificacao } from '../model/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.css']
})
export class PaginaInicialComponent implements OnInit {

  pessoa: Pessoa = new Pessoa();

  curriculo: Curriculo = new Curriculo();
  formacao: Formacao = new Formacao();
  infos: InfoAdicionais = new InfoAdicionais();
  trabalho: Trabalho = new Trabalho();

  temInteresses: boolean;
  interesses = [];

  seguindo = [];
  seguidores = [];
  
  cientista: boolean;
  dataNascimento: string;
  tempoEmAtividade: string;

  listaDeNotificacao = [];
  temNotificacao = false;
  notificacoes = [];

  isCientista = false;

  constructor(private pessoaService: PessoaService, private router: Router) {
  }

  ngOnInit() {
    this.getPessoa();
    this.getNotificacao();
  }

  getNotificacao(){
    this.pessoaService.getNotificacao(localStorage.getItem("email")).subscribe(
      data => {
        this.listaDeNotificacao = data;
        if(this.listaDeNotificacao.length > 0){
          for (let i = 0; i < this.listaDeNotificacao.length; i++) {
            if(this.listaDeNotificacao[i].tipoPublicacao != null && this.listaDeNotificacao[i].visualizacao == false){              
              let notificacao: Notificacao = new Notificacao();
              notificacao.tipoPublicacao = this.listaDeNotificacao[i].tipoPublicacao;
              notificacao.titulo = this.listaDeNotificacao[i].titulo;
              notificacao.autor = this.listaDeNotificacao[i].autor;
              notificacao.visualizacao = this.listaDeNotificacao[i].visualizacao;
              this.notificacoes.unshift(notificacao);
            }
          }
        }      
        if(this.notificacoes.length > 0){
          this.temNotificacao = true;
        } 
      }
    );
  }

  goToPerfil(x: any){
    localStorage.setItem("emailPerfil", x.email);
    this.router.navigateByUrl("perfil");
  }

  getSeguindo(id: any){
    this.pessoaService.getSeguindo(id).subscribe( 
      data => {
        this.seguindo = data;
        console.log(data);
      }      
    );
  }

  getSeguidores(id: any){
    this.pessoaService.getSeguidores(id).subscribe( 
      data => {
        this.seguidores = data;  
        console.log(data);
      }      
    );
  }

  getPessoa() {
    this.pessoaService.getPessoaByEmail(localStorage.getItem("email")).subscribe(
      data => {
        this.pessoa = data;
        
        this.curriculo = this.pessoa.curriculo;

        this.formacao = data.formacao;

        this.infos = data.infos;

        this.trabalho = data.trabalho;
        let str = data.infos.dataNascimento;
        let array = str.split("-");
        let final = array[2] + "/" + array[1] + "/" + array[0];
        this.dataNascimento = final.toString();

        this.getSeguidores(data.id);
        this.getSeguindo(data.id);

        let dataInicioCientista = data.infos.dataInicioCientista;
        const now = new Date();
        const past = new Date(dataInicioCientista);
        const dif = Math.abs(now.getTime() - past.getTime());
        const days = Math.floor(dif / (1000 * 60 * 60 * 24));

        if (days < 365) {
          let final2 = Math.floor(days / 30);
          this.tempoEmAtividade = final2.toString() + " mes(es)";
        } else {
          let final2 = Math.floor(days / 365);
          this.tempoEmAtividade = final2.toString() + " ano(s)";
        }

        if (data.interesses == "" || data.interesses == null) {
          this.temInteresses = false;
        } else {
          this.temInteresses = true;
          this.interesses = this.pessoa.interesses.split(",");
        }

        this.cientista = this.verificarPessoa();
      }
    );
  }

  verificarPessoa() {
    if (this.pessoa.trabalho != null) {
      return true;
    } else {
      return false;
    }
  }

}
