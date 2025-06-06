import React, { useEffect, useState } from "react";

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

  const [formData, setFormData] = useState<Product>({
    id: 0,
    nome: "",
    produttore: "",
    foto: "",
    prezzo: 0,
    descrizione: "",
    categoria: "",
  });
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:3000/api/products/${formData.id}`
        : "http://localhost:3000/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Errore salvataggio prodotto");

      setFormData({
        id: 0,
        nome: "",
        produttore: "",
        foto: "",
        prezzo: 0,
        descrizione: "",
        categoria: "",
      });
      setIsEditing(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

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

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prezzo" ? Number(value) : value,
    }));
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
            {currentUser.ruolo === "admin" && (
              <>
                <button onClick={() => handleEdit(p)}>Modifica</button>
                <button onClick={() => handleDelete(p.id)}>Elimina</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {currentUser.ruolo === "admin" && (
        <>
          <h3>{isEditing ? "Modifica prodotto" : "Aggiungi nuovo prodotto"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome"
              required
            />
            <input
              name="produttore"
              value={formData.produttore}
              onChange={handleChange}
              placeholder="Produttore"
              required
            />
            <input
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              placeholder="URL foto"
              required
            />
            <input
              name="prezzo"
              type="number"
              value={formData.prezzo}
              onChange={handleChange}
              placeholder="Prezzo"
              required
            />
            <textarea
              name="descrizione"
              value={formData.descrizione}
              onChange={handleChange}
              placeholder="Descrizione"
              required
            />
            <input
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Categoria"
              required
            />
            <button type="submit">{isEditing ? "Aggiorna" : "Aggiungi"}</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Products;
