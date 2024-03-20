import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Tabs align="center" height={"4vh"}>
        <TabList backgroundColor={"white"}>
          <Tab>
            <Link to="/">Voting</Link>
          </Tab>
          {/* <Tab>
            <Link to="/results">Results</Link>
          </Tab> */}
        </TabList>
      </Tabs>
      <Outlet />
    </>
  );
};

export default Layout;
