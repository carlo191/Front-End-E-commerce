import { useEffect, useState } from "react";
import ProductsCard from "./productscard";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/products") 
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento prodotti:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Caricamento in corso...</p>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductsCard key={product.id} {...product} />
      ))}
    </div>
  );
}
