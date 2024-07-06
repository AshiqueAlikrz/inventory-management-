import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Page from "./pages/Page";
import ViewContainer from "./pages/viewContainer";
import Reports from "./pages/Reports";

import { billingDataContext } from "./contexts/DataContext";

function App() {
  return (
    <div className="App">
      <billingDataContext.Provider value={"h"}>
        <Router>
          <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/view" element={<ViewContainer />} />
            <Route path="/report" element={<Reports />} />
          </Routes>
        </Router>
      </billingDataContext.Provider>
    </div>
  );
}

export default App;
