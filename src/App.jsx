import './styles/App.css'
import Home from "./components/Home.jsx";
import {Route, Routes} from "react-router";
import CreateGame from "./components/CreateGame.jsx";
import PlayGame from "./components/PlayGame.jsx";

function App() {

  return (
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateGame />} />
          <Route path="/play" element={<PlayGame />} />
      </Routes>
  )
}

export default App
