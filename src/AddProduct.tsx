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

      setMessage("Prodotto aggiunto con successo!");
      setFormData({
        nome: "",
        produttore: "",
        foto: "",
        prezzo: 0,
        descrizione: "",
        categoria: "",
      });
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h3>Aggiungi nuovo prodotto (solo admin)</h3>
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
        />
        <input
          name="prezzo"
          type="text"
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
        />
        <input
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          placeholder="Categoria"
          required
        />
        <button type="submit">Aggiungi</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
