import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  nome: string;
  produttore: string;
  foto: string;
  prezzo: number | string; 
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
      .then((res) => {
        if (!res.ok) throw new Error("Prodotto non trovato");
        return res.json();
      })
      .then((data) => {
        // prezzo lo trasformiamo in stringa per input libero
        data.prezzo = data.prezzo.toString();
        setProduct(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!product) return;
    const { name, value } = e.target;

    if (name === "prezzo") {
      // Rimuovi lettere
      let pulito = value.replace(/[a-zA-Z]/g, "");

      // Permetti solo numeri, punto e virgola e al massimo due cifre decimali
    
      const regex = /^(\d+)?([.,]{1}(\d{0,2})?)?$/;

      if (pulito === "" || regex.test(pulito)) {
        setProduct({
          ...product,
          [name]: pulito,
        });
      }
      
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      // convertiamo prezzo in number prima di mandare
      const prezzoNumber = Number(product.prezzo.toString().replace(",", "."));

      if (isNaN(prezzoNumber)) {
        setError("Prezzo non valido");
        return;
      }

      const payload = {
        ...product,
        prezzo: prezzoNumber,
      };

      const res = await fetch(
        `http://localhost:3000/api/products/${product.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Errore aggiornamento prodotto");

      alert("Prodotto aggiornato!");
      navigate("/products");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="alert alert-info">Caricamento...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product)
    return <div className="alert alert-warning">Prodotto non trovato</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Modifica prodotto</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded bg-light shadow-sm"
      >
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            className="form-control"
            value={product.nome}
            onChange={handleChange}
            placeholder="Nome"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="produttore" className="form-label">
            Produttore
          </label>
          <input
            id="produttore"
            name="produttore"
            type="text"
            className="form-control"
            value={product.produttore}
            onChange={handleChange}
            placeholder="Produttore"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="foto" className="form-label">
            URL Foto
          </label>
          <input
            id="foto"
            name="foto"
            type="text"
            className="form-control"
            value={product.foto}
            onChange={handleChange}
            placeholder="URL foto"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="prezzo" className="form-label">
            Prezzo (€)
          </label>
          <input
            id="prezzo"
            name="prezzo"
            type="text"
            className="form-control"
            value={product.prezzo}
            onChange={handleChange}
            placeholder="Prezzo"
            required
          />
          <div className="form-text">
            Puoi inserire numeri, punto o virgola. Lettere non permesse.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="descrizione" className="form-label">
            Descrizione
          </label>
          <textarea
            id="descrizione"
            name="descrizione"
            className="form-control"
            rows={3}
            value={product.descrizione}
            onChange={handleChange}
            placeholder="Descrizione"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">
            Categoria
          </label>
          <input
            id="categoria"
            name="categoria"
            type="text"
            className="form-control"
            value={product.categoria}
            onChange={handleChange}
            placeholder="Categoria"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Salva
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
