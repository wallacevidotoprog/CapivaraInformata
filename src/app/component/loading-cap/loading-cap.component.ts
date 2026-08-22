import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-cap',
  standalone: true,
  templateUrl: './loading-cap.component.html',
  styleUrls: ['./loading-cap.component.scss'],
})
export class LoadingCapComponent implements OnInit {
  @Input() message: string = '';

  private readonly phrases: string[] = [
    'Aguarde, estamos trabalhando a velocidade de 1 capivara! 🐾',
    'A capivara está mastigando seus dados... 🌿',
    'Processando na velocidade capivarística... 💨',
    'Relaxa que a capivara tá cuidando de tudo! 😌',
    'Nadando entre os bytes do seu PDF... 🏊',
    'A capivara mais inteligente do pântano está trabalhando! 🧠',
    'Carregando... hora do banho de lama! 🛁',
    'Convertendo com calma, tipo capivara no sol... ☀️',
    'Os PDFs estão sendo acariciados pela capivara... 🐾',
    'Operação em andamento: modo zen ativado 🧘',
  ];

  ngOnInit() {
    if (!this.message) {
      this.message = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    }
  }
}
