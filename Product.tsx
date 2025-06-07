import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Tipo prodotto
export interface Product {
  id: number;
  nome: string;
  produttore: string;
  foto: string;
  prezzo: number;
  descrizione: string;
  categoria: string;
}

// Tipo utente per props
type User = {
  id: number;
  nome: string;
  ruolo: "admin" | "user";
  email: string;
};

// Props: serve il currentUser
type ProductsProps = {
  currentUser: User;
};

const Products: React.FC<ProductsProps> = ({ currentUser }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/products");
      if (!res.ok) throw new Error("Errore caricamento prodotti");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo prodotto?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Errore eliminazione prodotto");
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDetail = (id: number) => {
    navigate(`/products/${id}`);
  };

  return (
    <div>
      <h2>Catalogo Prodotti</h2>

      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <strong>{p.nome}</strong> - {p.produttore} - €{p.prezzo.toFixed(2)}{" "}
            <button onClick={() => handleDetail(p.id)}>Vedi dettagli</button>
            {currentUser.ruolo === "admin" && (
              <>
                <button onClick={() => handleDelete(p.id)}>Elimina</button>
                <button onClick={() => navigate(`/products/edit/${p.id}`)}>
                  Modifica
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
