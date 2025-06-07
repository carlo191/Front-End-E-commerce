import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Products from "../Product";
import AddProduct from "./AddProduct";

import ProductDetail from "../ProductDetail";
import EditProduct from "../EditProduct"; // Import componente edit

type User = {
  id: number;
  nome: string;
  ruolo: "admin" | "user";
  email: string;
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        <nav style={{ marginBottom: 20 }}>
          {!currentUser ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" style={{ marginLeft: 10 }}>
                Registrazione
              </Link>
            </>
          ) : (
            <>
              <span>
                Benvenuto, {currentUser.nome} ({currentUser.ruolo})
              </span>
              <button onClick={handleLogout} style={{ marginLeft: 10 }}>
                Logout
              </button>
              <Link to="/products" style={{ marginLeft: 10 }}>
                Catalogo Prodotti
              </Link>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onRegister={handleLogin} />}
          />
          <Route
            path="/products"
            element={
              currentUser ? (
                <>
                  <Products currentUser={currentUser} />
                  {currentUser.ruolo === "admin" && <AddProduct />}
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/products/:id"
            element={currentUser ? <ProductDetail /> : <Navigate to="/login" />}
          />
          {/* Route per edit prodotto */}
          <Route
            path="/products/edit/:id"
            element={currentUser ? <EditProduct /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
