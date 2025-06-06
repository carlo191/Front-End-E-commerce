import React, { useState } from "react";

// Tipo utente da esportare per riutilizzo
export type User = {
  id: number;
  nome: string;
  ruolo: "admin" | "user";
  email: string;
};

// Tipo per le props che il componente riceve
type LoginProps = {
  onLogin: (user: User) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user; // ✅ Estrai l'oggetto utente corretto
        setMessage(`Login effettuato! Benvenuto ${user.nome} (${user.ruolo})`);
        onLogin(user); // ✅ Passa l'utente corretto
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Accedi</button>
      </form>
      <div>{message}</div>
    </div>
  );
};

export default Login;
