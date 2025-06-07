import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export type User = {
  id: number;
  nome: string;
  ruolo: "admin" | "user";
  email: string;
};

type LoginProps = {
  onLogin: (user: User) => void;
};
import "bootstrap/dist/css/bootstrap.min.css";
const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
        const user = data.user;
        setMessage(`Login effettuato! Benvenuto ${user.nome} (${user.ruolo})`);
        onLogin(user);
        navigate("/products");
      } else {
        const error = await res.json();
        setMessage(`Errore: ${error.message}`);
      }
    } catch (error) {
      setMessage("Errore di connessione al server");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            id="email"
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Inserisci email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Inserisci password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Accedi
        </button>
      </form>
      {message && (
        <div className="alert alert-info mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;
