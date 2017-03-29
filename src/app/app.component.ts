import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { Http } from '@angular/http';
import { Product } from '../entities/product/product';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ProductService]
})

export class AppComponent implements OnInit {

  title = 'Tour of Heroes Test';
  product: Product;
  products: Product[];


  constructor(private ps: ProductService) {
      
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.ps.getProducts().then(products => this.products = products);
  }

}