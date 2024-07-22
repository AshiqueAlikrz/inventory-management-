import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Page from "./pages/Page";
import ViewContainer from "./pages/viewContainer";
import Reports from "./pages/Reports";
import Invoice from "./components/Invoice";
import { billingDataContext } from "./contexts/DataContext";
import { useState } from "react";

function App() {
  const [billingData, setBillingData] = useState({ name: "", date: "", items: [], subTotal: 0, discount: 0, totalAmount: 0 });

  return (
    <div className="App">
      <billingDataContext.Provider value={{ setBillingData, billingData }}>
        <Router>
          <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/view" element={<ViewContainer />} />
            <Route path="/report" element={<Reports />} />
            <Route path="/invoice" element={<Invoice />} />
          </Routes>
        </Router>
      </billingDataContext.Provider>
    </div>
  );
}

export default App;
