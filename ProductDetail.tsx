import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Tipo prodotto
interface Product {
  id: number;
  nome: string;
  produttore: string;
  foto: string;
  prezzo: number;
  descrizione: string;
  categoria: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>(); // id è stringa dai parametri url
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Prodotto non trovato");
        return res.json();
      })
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <p>Prodotto non trovato.</p>;

  return (
    <div>
      <h2>{product.nome}</h2>
      <img src={product.foto} alt={product.nome} width={200} />
      <p>Produttore: {product.produttore}</p>
      <p>Prezzo: €{product.prezzo.toFixed(2)}</p>
      <p>Descrizione: {product.descrizione}</p>
      <p>Categoria: {product.categoria}</p>
    </div>
  );
};

export default ProductDetail;
