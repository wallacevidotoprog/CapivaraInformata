import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-cap',
  templateUrl: './loading-cap.component.html',
  styleUrls: ['./loading-cap.component.scss'],
})
export class LoadingCapComponent {
  @Input() message: string =
    'Aguarde, estamos trabalhando a velocidade de 1 capivara de velocidade máxima!';
}
