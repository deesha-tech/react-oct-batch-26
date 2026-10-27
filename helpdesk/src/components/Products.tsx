import axios from "axios";
import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productService";
import { Spinner } from "react-bootstrap";
import ProductList from "./ProductList";

export interface Product {
  id: number;
  title: string;
  price: number;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

function Products() {

  //the parent component owns the state of the products and passes it down to the child component

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const controller = new AbortController();

    async function load() {
      try {
        
        const response = await axios.get<ProductResponse>("https://dummyjson.com/products",{
            signal: controller.signal,
            params: { limit: 10, select: "id,title,price" },
          },
        );
        setProducts(response.data.products);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        }
      }finally {
        if(!controller.signal.aborted) 
          setLoading(false);
      }
    }
  
    load();

    return () => controller.abort();
  
  }, [products]);

  return (
    <div>
      <h1>Product List</h1>
      <Spinner hidden={!loading} />

      {error && <p>Error: {error}</p>}

      {products.length>0 && <ProductList products={products} />}

    </div>
  );
}

export default Products;
