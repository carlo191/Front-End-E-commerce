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
    if (!window.confirm("Sei sicuro di voler eliminare questo prodotto?"))
      return;

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
    <div className="container my-4">
      <h2 className="mb-4 text-center">Catalogo Prodotti</h2>

      {loading && <div className="alert alert-info">Caricamento...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{p.nome}</h5>
                <p className="card-text">
                  <strong>Produttore:</strong> {p.produttore}
                  <br />
                  <strong>Prezzo:</strong> €{p.prezzo.toFixed(2)}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDetail(p.id)}
                >
                  Dettagli
                </button>
                {currentUser.ruolo === "admin" && (
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => navigate(`/products/edit/${p.id}`)}
                    >
                      Modifica
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      Elimina
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
