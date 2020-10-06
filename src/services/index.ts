import { Application } from '../declarations';
import authors from './authors/authors.service';
import products from './products/products.service';

export default function (app: Application): void {
  app.configure(authors);
  app.configure(products);
}
