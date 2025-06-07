import React, { useState } from "react";

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    produttore: "",
    foto: "",
    prezzo: "", // stringa per gestione input testuale
    descrizione: "",
    categoria: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "prezzo") {
      // Rimuove tutte le lettere (a-zA-Z)
      let pulito = value.replace(/[a-zA-Z]/g, "");

      // Regex che permette solo numeri, un punto o una virgola e massimo 2 cifre decimali
      const regex = /^(\d+)?([.,]{1}(\d{0,2})?)?$/;

      if (pulito === "" || regex.test(pulito)) {
        setFormData((prev) => ({
          ...prev,
          [name]: pulito,
        }));
      }
      // altrimenti ignora il cambiamento (non aggiorna lo stato)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // converto prezzo: virgola -> punto, tolgo spazi, parseFloat
    const prezzoPulito = formData.prezzo.replace(/\s/g, "").replace(",", ".");
    const prezzoNumero = parseFloat(prezzoPulito);

    if (isNaN(prezzoNumero) || prezzoNumero < 0) {
      setMessage("❌ Prezzo non valido");
      return;
    }

    const datiDaInviare = {
      ...formData,
      prezzo: prezzoNumero,
    };

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datiDaInviare),
      });

      if (!res.ok) throw new Error("Errore durante l'aggiunta del prodotto");

      setMessage("✅ Prodotto aggiunto con successo!");
      setFormData({
        nome: "",
        produttore: "",
        foto: "",
        prezzo: "",
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
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-light"
      >
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
            type="text"
            className="form-control"
            value={formData.prezzo}
            onChange={handleChange}
            placeholder="Prezzo"
            required
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
        <div
          className={`alert mt-4 ${
            message.startsWith("✅") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddProduct;
