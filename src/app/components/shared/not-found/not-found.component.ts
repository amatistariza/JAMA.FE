import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="container text-center mt-5">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que estás buscando no existe.</p>
      <button class="btn btn-primary" routerLink="/">Volver al inicio</button>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}
