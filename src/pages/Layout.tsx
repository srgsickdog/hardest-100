import { useState, useEffect } from "react";
import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { Outlet, Link, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  // Initialize activeTab based on the initial pathname
  const [activeTab, setActiveTab] = useState(() => {
    const { pathname } = location;
    if (pathname === "/") {
      return "Voting";
    } else if (pathname === "/results") {
      return "Results";
    } else if (pathname === "/allResults") {
      return "All Results";
    }
    return "";
  });

  useEffect(() => {
    const { pathname } = location;
    if (pathname === "/") {
      setActiveTab("Voting");
    } else if (pathname === "/results") {
      setActiveTab("Results");
    } else if (pathname === "/allResults") {
      setActiveTab("All Results");
    }
  }, [location]);

  return (
    <>
      {/* @ts-ignore */}
      <Tabs align="center" height={"4vh"} defaultIndex={0} index={activeTab}>
        <TabList backgroundColor={"white"}>
          <Tab name="Voting">
            <Link to="/">Voting</Link>
          </Tab>
          {/* <Tab name="Results">
            <Link to="/results">Results</Link>
          </Tab>
          <Tab name="All Results">
            <Link to="/allResults">All Results</Link>
          </Tab> */}
        </TabList>
      </Tabs>
      <Outlet />
    </>
  );
};

export default Layout;
