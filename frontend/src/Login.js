import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("admin@securehr.com");
  const [password, setPassword] = useState("admin123");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");

    } catch (err) {

      setMessage(
        err.response?.data?.message ||
        "Erreur serveur"
      );

    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          👥
        </div>

        <h1>HR Platform</h1>

        <p>
          Connectez-vous à votre compte
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label>Mot de passe</label>

          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <div className="login-options">

            <span>
              ☑ Se souvenir de moi
            </span>

            <span className="forgot-password">
              Mot de passe oublié ?
            </span>

          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Se connecter
          </button>

          {message && (
            <div className="error-message">
              {message}
            </div>
          )}

          <div className="register-text">

            <p>
              Vous n'avez pas de compte ?
            </p>

            <strong>
              Créer un compte
            </strong>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;