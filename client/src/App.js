import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./components/Home"
import ChatPage from "./components/ChatPage";
import socketIO from "socket.io-client"
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

const socket = socketIO.connect("http://localhost:4000")
function App() {
  return (
    <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home socket={socket}/>}></Route>
            <Route path="/chat" element={<ChatPage socket={socket}/>}></Route>
            <Route path="/signup" element={<Signup socket={socket}/>}></Route>
            <Route path="/forgot_password" element={<ForgotPassword socket={socket}/>}></Route>
          </Routes>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
