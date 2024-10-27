import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  newProduct = { name: '', price: 0, description: '' };
  products: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.api.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  addProduct(): void {
    this.api.addProduct(this.newProduct).subscribe((result: any) => {
      console.log(result);
      this.getProducts();
      this.newProduct = { name: '', price: 0, description: '' };
    });
  }

  deleteProduct(productId: any): void {
    this.api.deleteProduct(productId).subscribe((result: any) => {
      console.log(result);
      this.getProducts();
    });
  }
}
