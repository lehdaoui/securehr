import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Employees from "./Employees";
import Reports from "./Reports";
import Logs from "./Logs";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* EMPLOYEES */}

        <Route
          path="/employees"
          element={<Employees />}
        />

        {/* REPORTS */}

        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* LOGS */}

        <Route
          path="/logs"
          element={<Logs />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;