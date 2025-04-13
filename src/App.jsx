import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppContext from "./Components/AppContext/AppContext";
import Messages from './Components/Messages/Messages';
import { Routes, Route } from "react-router-dom";
import Pages from "./Components/Pages/Pages";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContext>
          <Routes>
            <Route path="/*" element={<Pages />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </AppContext>
      </BrowserRouter>
    </div>
  );
}

export default App;
