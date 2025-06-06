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
        const data = await res.json(); // supponiamo il server ritorni l’utente registrato

        setMessage(
          "Registrazione completata con successo! Ora puoi fare il login."
        );

        // chiama onRegister per aggiornare lo stato utente in App.tsx
        onRegister(data);

        // pulisci campi se vuoi:
        setNome("");
        setCognome("");
        setDataNascita("");
        setEmail("");
        setPassword("");
      } else {
        const error = await res.json();
        setMessage(`Errore: ${error.message}`);
      }
    } catch (error) {
      setMessage("Errore di connessione al server");
    }
  };

  return (
    <div>
      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <br />
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
        <br />
        <br />
        <label>
          Cognome:
          <br />
          <input
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            required
          />
        </label>
        <br />
        <br />
        <label>
          Data di nascita:
          <br />
          <input
            type="date"
            value={dataNascita}
            onChange={(e) => setDataNascita(e.target.value)}
            required
          />
        </label>
        <br />
        <br />
        <label>
          Email:
          <br />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <br />
        <label>
          Password:
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <br />
        <button type="submit">Registrati</button>
      </form>
      <div>{message}</div>
    </div>
  );
};

export default Register;
