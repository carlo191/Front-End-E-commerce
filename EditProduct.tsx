import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  nome: string;
  produttore: string;
  foto: string;
  prezzo: number;
  descrizione: string;
  categoria: string;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Prodotto non trovato");
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!product) return;
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "prezzo" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const res = await fetch(`http://localhost:3000/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Errore aggiornamento prodotto");
      alert("Prodotto aggiornato!");
      navigate("/products");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Prodotto non trovato</p>;

  return (
    <div>
      <h2>Modifica prodotto</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nome"
          value={product.nome}
          onChange={handleChange}
          placeholder="Nome"
          required
        />
        <input
          name="produttore"
          value={product.produttore}
          onChange={handleChange}
          placeholder="Produttore"
          required
        />
        <input
          name="foto"
          value={product.foto}
          onChange={handleChange}
          placeholder="URL foto"
        />
        <input
          name="prezzo"
          type="number"
          value={product.prezzo}
          onChange={handleChange}
          placeholder="Prezzo"
          required
        />
        <textarea
          name="descrizione"
          value={product.descrizione}
          onChange={handleChange}
          placeholder="Descrizione"
        />
        <input
          name="categoria"
          value={product.categoria}
          onChange={handleChange}
          placeholder="Categoria"
          required
        />
        <button type="submit">Salva</button>
      </form>
    </div>
  );
};

export default EditProduct;
