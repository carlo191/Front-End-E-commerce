import React, { useState } from "react";

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    produttore: "",
    foto: "",
    prezzo: 0,
    descrizione: "",
    categoria: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prezzo" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Errore durante l'aggiunta del prodotto");

      setMessage("✅ Prodotto aggiunto con successo!");
      setFormData({
        nome: "",
        produttore: "",
        foto: "",
        prezzo: 0,
        descrizione: "",
        categoria: "",
      });
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Aggiungi nuovo prodotto (solo admin)</h3>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            name="nome"
            className="form-control"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Produttore</label>
          <input
            name="produttore"
            className="form-control"
            value={formData.produttore}
            onChange={handleChange}
            placeholder="Produttore"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">URL Foto</label>
          <input
            name="foto"
            className="form-control"
            value={formData.foto}
            onChange={handleChange}
            placeholder="URL immagine"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Prezzo (€)</label>
          <input
            name="prezzo"
            type="number"
            className="form-control"
            value={formData.prezzo}
            onChange={handleChange}
            placeholder="Prezzo"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrizione</label>
          <textarea
            name="descrizione"
            className="form-control"
            rows={3}
            value={formData.descrizione}
            onChange={handleChange}
            placeholder="Descrizione"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <input
            name="categoria"
            className="form-control"
            value={formData.categoria}
            onChange={handleChange}
            placeholder="Categoria"
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-success w-100">
            Aggiungi
          </button>
        </div>
      </form>

      {message && (
        <div className={`alert mt-4 ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddProduct;
