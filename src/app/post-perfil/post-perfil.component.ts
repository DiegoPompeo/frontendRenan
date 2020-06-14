import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../model/model';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-post-perfil',
  templateUrl: './post-perfil.component.html',
  styleUrls: ['./post-perfil.component.css']
})
export class PostPerfilComponent implements OnInit {

  @Input() post: Post;

  status: any;
  
  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.verificar();
  }

  analisePost(idPostCurtido: number, idPessoaCurtiu: number){
    this.postService.analisarPost(idPostCurtido, idPessoaCurtiu).subscribe(
      data => {
        if(data){
          this.status = "Descurtir";
        } else {
          this.status = "Curtir";
        }
      }
    )
  }

  verificar(){
    this.analisePost(this.post.id, +(localStorage.getItem("idUsuario")));
  }

  botao(idPostCurtido: number){
    if(this.status == "Curtir"){
      this.postService.curtirPost(+(localStorage.getItem("idUsuario")), idPostCurtido).subscribe(
        data => {
          this.post = data;
          this.analisePost(this.post.id ,+(localStorage.getItem("idUsuario")));
        }
      );
    } else if (this.status == "Descurtir") {
      this.postService.undoCurtirPost(+(localStorage.getItem("idUsuario")), idPostCurtido).subscribe(
        data => {
          this.post = data;
          this.analisePost(this.post.id ,+(localStorage.getItem("idUsuario")));
        }
      );
    }
  }
}
