import React, { useState } from "react";

function AddProduct() {
  const [nome, setNome] = useState("");
  const [prezzo, setPrezzo] = useState("");
  // altri campi...

  const handleSubmit = () => {
    // fai chiamata POST al backend per aggiungere prodotto
    fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, prezzo: Number(prezzo) }),
    }).then(() => {
      alert("Prodotto aggiunto!");
      setNome("");
      setPrezzo("");
    });
  };

  return (
    <div>
      <h3>Aggiungi prodotto (solo admin)</h3>
      <input
        placeholder="Nome prodotto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="number"
        placeholder="Prezzo"
        value={prezzo}
        onChange={(e) => setPrezzo(e.target.value)}
      />
      <button onClick={handleSubmit}>Aggiungi</button>
    </div>
  );
}

export default AddProduct;
