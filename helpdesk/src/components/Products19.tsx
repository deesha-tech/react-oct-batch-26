import axios from "axios";
import ProductList19 from "./ProductList19";
import type { ProductResponse } from "./Products";
import { Suspense, useState } from "react";
import { Spinner } from "react-bootstrap";

export async function fetchProducts(): Promise<ProductResponse> {
  const { data } = await axios.get<ProductResponse>(
    "https://dummyjson.com/products",
    { params: { limit: 10, select: "id,title,price" } },
  );
  return data;
}

function Products19() {
  let productsPromise: Promise<ProductResponse> | null = null;

  function getPromise() {
    productsPromise ??= fetchProducts();
    return productsPromise;
  }

  return (
    <div>
      <h1>Product List</h1>
      
      <Suspense fallback={<Spinner />}>
        <ProductList19 promise={getPromise()} />
      </Suspense>
    </div>
  );
}

export default Products19;
