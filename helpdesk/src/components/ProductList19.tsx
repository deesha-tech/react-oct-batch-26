import { use } from "react";
import type { ProductResponse } from "./Products";


function ProductList19({promise}: {promise: Promise<ProductResponse>}) {

    const {products} = use(promise); 

    return (
        <div>
            <h1>Total Products Fetched : {products.length}</h1>
            //show the products in a table with 3 columns : id, title, price
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList19;