import { Product } from '../../../entities/product/product';

export const PRODUCTS: Product[] = [
    { productId: 1, description: "test1" } as Product,
    { productId: 2, description: "test2" } as Product,
    { productId: 3, description: "test3" } as Product

];

export class FakeProductService {

    products = PRODUCTS;
    lastPromise: Promise<any>; //so we can spy on promise calls

    getProducts(): Promise<Product[]> {

        return this.lastPromise = Promise.resolve<Product[]>(this.products);
    }
}


