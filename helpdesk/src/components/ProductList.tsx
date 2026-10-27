import type { Product } from "./Products";

interface ProductListProps {
    products: Product[];
}

function ProductList({products}: ProductListProps) {
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

export default ProductList;