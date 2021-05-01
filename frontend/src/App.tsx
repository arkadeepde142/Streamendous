import * as React from "react";
import { ChakraProvider, theme, Link, HStack, StackDivider, Text} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch, Link as RouteLink } from "react-router-dom";
import { HomeScreen } from "./routes";
import { ProfileScreen } from "./routes";
import { UploadScreen } from "./routes";
import { PlayScreen } from "./routes";

type NavLinkProps = { text: string, path : string };
const NavLink = ({ text, path }: NavLinkProps) => (
  <Link as={RouteLink} to={path}>
    <Text fontSize="xl">{text}</Text>
  </Link>
);

const NavBar = () => (
  <HStack spacing={3} divider={<StackDivider />} as="nav">
    <NavLink path="/" text="Home"/>
    <NavLink path="/profile" text="Profile"/>
    <NavLink path="/upload" text="Upload"/>
  </HStack>
);

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
    <NavBar/>
      <Switch>
        <Route path="/profile">
          <ProfileScreen/>
        </Route>
        <Route path="/play">
          <PlayScreen />
        </Route>
        <Route path="/upload">
          <UploadScreen />
        </Route>
        <Route path="/">
          <HomeScreen/>
        </Route>
      </Switch>
    </Router>
  </ChakraProvider>
);
