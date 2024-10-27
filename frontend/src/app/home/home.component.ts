import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  searchItem: string = '';
  email: string = '';
  username: string = '';
  wishlistMsg: string = '';
  wishlist: number[] = [];
  cart: number[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve user info from local storage
    this.email = localStorage.getItem('email') || '';
    this.username = localStorage.getItem('username') || '';

    // Load products
    this.getProducts();

    // Load wishlist and cart only if user is logged in
    if (this.email) {
      this.getMyItems();
    }

    // Subscribe to searchKey changes
    this.api.searchKey.subscribe((result: string) => {
      this.searchItem = result;
    });
  }

  getProducts(): void {
    this.api.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  addToWishlist(productId: number) {
    this.api.addToWishlist(this.email, productId).subscribe(
      (result: any) => {
        this.wishlistMsg = result.message;
        this.getMyItems(); // Refresh wishlist
        setTimeout(() => (this.wishlistMsg = ''), 5000);
      },
      (error: any) => {
        this.wishlistMsg = error.error.message;
      }
    );
  }

  removeFromWishlist(productId: number) {
    this.api.removeFromWishlist(this.email, productId).subscribe(
      (result: any) => {
        this.wishlistMsg = result.message;
        this.getMyItems(); // Refresh wishlist
        setTimeout(() => (this.wishlistMsg = ''), 5000);
      },
      (error: any) => {
        this.wishlistMsg = error.error.message;
      }
    );
  }

  getMyItems() {
    this.api.getWishlist(this.email).subscribe(
      (result: any) => {
        // Extract product IDs for wishlist and cart
        this.wishlist = result.wishlist.map((item: any) => item.productId);
        this.cart = result.cart.map((item: any) => item.productId);

        // Sync with service variables if used elsewhere
        this.api.apiWishlist = this.wishlist;
        this.api.apiCart = this.cart;
        this.api.cartCount.next(this.cart);

        // Update localStorage values
        localStorage.setItem('username', result.username);
        localStorage.setItem('email', result.email);
        localStorage.setItem('wishlist', JSON.stringify(result.wishlist));
        localStorage.setItem('cart', JSON.stringify(result.cart));
        localStorage.setItem('token', result.token);
      },
      (error: any) => {
        console.error(error.error.message);
      }
    );
    
  }
}
