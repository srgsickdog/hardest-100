import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import PageOne from "./pages/PageOne";
import PageTwo from "./pages/PageTwo";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pageOne" element={<PageOne />} />
          <Route path="pageTwo" element={<PageTwo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
