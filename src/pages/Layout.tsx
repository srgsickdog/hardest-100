import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Link style={{ marginRight: "3rem" }} to="/">
          Home
        </Link>
        <Link style={{ marginRight: "3rem" }} to="/pageOne">
          Page One
        </Link>
        <Link to="/pageTwo">Page Two</Link>
      </div>
      <Outlet />
    </>
  );
};

export default Layout;
