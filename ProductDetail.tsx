import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const { id } = useParams<{ id: string }>();
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

  if (!product)
    return <p className="text-center mt-4">Prodotto non trovato.</p>;

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card" style={{ maxWidth: 600, width: "100%" }}>
        <img
          src={
            product.foto ||
            "https://dummyimage.com/600x400/cccccc/000000&text=No+Image"
          }
          alt={product.nome}
          className="card-img-top"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://via.placeholder.com/600x400?text=No+Image";
          }}
        />
        <div className="card-body">
          <h3 className="card-title">{product.nome}</h3>
          <p className="card-text">
            <strong>Produttore:</strong> {product.produttore}
          </p>
          <p className="card-text">
            <strong>Prezzo:</strong> €{product.prezzo.toFixed(2)}
          </p>
          <p className="card-text">
            <strong>Descrizione:</strong> {product.descrizione}
          </p>
          <p className="card-text">
            <strong>Categoria:</strong> {product.categoria}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
