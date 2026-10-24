import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { setUserData } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import { me } from "./features/me";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await me();
      dispatch(setUserData(userData));
    };

    fetchData();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;