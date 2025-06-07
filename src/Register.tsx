import React, { useState } from "react";

// Tipo utente da esportare per riutilizzo
export type User = {
  id: number;
  nome: string;
  ruolo: "admin" | "user";
  email: string;
};

type RegisterProps = {
  onRegister: (user: User) => void;
};

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cognome, dataNascita, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("✅ Registrazione completata con successo!");
        onRegister(data);
        setNome("");
        setCognome("");
        setDataNascita("");
        setEmail("");
        setPassword("");
      } else {
        const error = await res.json();
        setMessage(`❌ Errore: ${error.message}`);
      }
    } catch (error) {
      setMessage("❌ Errore di connessione al server");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Registrazione</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cognome</label>
          <input
            type="text"
            className="form-control"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Data di nascita</label>
          <input
            type="date"
            className="form-control"
            value={dataNascita}
            onChange={(e) => setDataNascita(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Registrati
        </button>
      </form>

      {message && (
        <div
          className={`alert mt-4 ${
            message.startsWith("✅")
              ? "alert-success"
              : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Register;
