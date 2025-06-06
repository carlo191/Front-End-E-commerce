import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Products from "../Product";
import AddProduct from "./AddProduct";

type User = {
  id: number;
  nome: string;
  ruolo: "admin" | "user";
  email: string;
};

function App() {
  // Stato per gestire cosa mostrare
  const [view, setView] = useState<"login" | "register" | "products">("login");

  // Stato per utente loggato (null se nessuno)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Funzione per simulare login (verrà chiamata da <Login />)
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView("products"); // dopo login vai al catalogo prodotti
  };

  // Funzione per logout
  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
  };

  return (
    <div className="App">
      <div style={{ marginBottom: 20 }}>
        {!currentUser ? (
          <>
            <button onClick={() => setView("login")}>Vai a Login</button>
            <button
              onClick={() => setView("register")}
              style={{ marginLeft: 10 }}
            >
              Vai a Registrazione
            </button>
          </>
        ) : (
          <>
            <span>
              Benvenuto, {currentUser.nome} ({currentUser.ruolo})
            </span>
            <button onClick={handleLogout} style={{ marginLeft: 10 }}>
              Logout
            </button>
            <button
              onClick={() => setView("products")}
              style={{ marginLeft: 10 }}
            >
              Vai a Catalogo Prodotti
            </button>
          </>
        )}
      </div>

      {!currentUser && view === "login" && <Login onLogin={handleLogin} />}
      {!currentUser && view === "register" && (
        <Register onRegister={handleLogin} />
      )}
      {currentUser && view === "products" && (
        <>
          {/* Passa currentUser a Products per gestire permessi */}
          <Products currentUser={currentUser} />
          {currentUser.ruolo === "admin" && <AddProduct />}
        </>
      )}
    </div>
  );
}

export default App;
