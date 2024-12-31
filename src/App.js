import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Profile, SignUp } from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
