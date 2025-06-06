import React, { useEffect, useState } from "react";
export interface Product {
  id: number;
  nome: string;
  produttore: string;
  foto: string; // URL o path
  prezzo: number;
  descrizione: string;
  categoria: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Stato per il form di aggiunta/modifica prodotto
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

  // Carica prodotti da backend
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

  // Handle form submit (crea o aggiorna)
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

  // Cancella prodotto
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

  // Carica prodotto nel form per modifica
  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
  };

  // Cambia valori form
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
            <button onClick={() => handleEdit(p)}>Modifica</button>
            <button onClick={() => handleDelete(p.id)}>Elimina</button>
          </li>
        ))}
      </ul>

      <h3>{isEditing ? "Modifica Prodotto" : "Aggiungi Prodotto"}</h3>

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
          placeholder="URL Foto"
        />
        <input
          type="number"
          name="prezzo"
          value={formData.prezzo}
          onChange={handleChange}
          placeholder="Prezzo"
          min="0"
          step="0.01"
          required
        />
        <textarea
          name="descrizione"
          value={formData.descrizione}
          onChange={handleChange}
          placeholder="Descrizione"
        />
        <input
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          placeholder="Categoria"
        />
        <button type="submit">
          {isEditing ? "Salva Modifiche" : "Aggiungi Prodotto"}
        </button>
      </form>
    </div>
  );
};

export default Products;
