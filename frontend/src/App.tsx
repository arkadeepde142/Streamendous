import * as React from "react";
import {
  ChakraProvider,
  theme,
  Link,
  HStack,
  Text,
  Spacer,
  Button,
  Flex,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link as RouteLink,
} from "react-router-dom";
import { HomeScreen } from "./routes";
import { ProfileScreen } from "./routes";
import { UploadScreen } from "./routes";
import { PlayScreen } from "./routes";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Signup, Login } from "./routes";
import { User, UserContext } from "./contexts";
import userContext from "./contexts/UserContext";
import axios from "axios";
export interface LoginResult {
  accessToken: {
    token: string;
    expires: number;
    issued: number;
  };
  user: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}
type NavLinkProps = { text: string; path: string };
const NavLink = ({ text, path }: NavLinkProps) => (
  <Link as={RouteLink} to={path}>
    <Text fontSize="xl">{text}</Text>
  </Link>
);

const NavBar = ({
  user,
  setUser,
}: {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) => (
  <Flex w={"100vw"}>
  <HStack spacing={[5,10]} margin={[2,5]} as="nav" w={"100vw"}>
    <NavLink path="/" text="Home" />
    <NavLink path="/profile" text="Profile" />
    <NavLink path="/upload" text="Upload" />
    <Spacer />
    {user && (
      <Button
        colorScheme="yellow"
        onClick={async () => {
          await axios.post(
            "http://localhost:5000/auth/logout",
            {},
            {
              headers: { Authorization: `Bearer ${user?.token}` },
              withCredentials: true,
            }
          );
          setUser(null)
        }}
      >
        Logout
      </Button>
    )}
    <ColorModeSwitcher justifySelf="flex-end" />
  </HStack>
  </Flex>
);

export const App = () => {
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/auth/renew",
          {},
          { withCredentials: true }
        );
        const loginResponse = response.data as LoginResult;
        const _user: User = {
          email: loginResponse.user.email,
          username: loginResponse.user.username,
          firstName: loginResponse.user.firstName,
          lastName: loginResponse.user.lastName,
          token: loginResponse.accessToken.token,
        };
        setUser(_user);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <userContext.Provider value={[user, setUser]}>
          <userContext.Consumer>
          {([user, setUser])=>(<NavBar user={user} setUser={setUser} />)}
          </userContext.Consumer>
          <Switch>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/profile">
              <ProfileScreen />
            </Route>
            <Route path="/play">
              <PlayScreen />
            </Route>
            <Route path="/upload">
              <UploadScreen />
            </Route>
            <Route path="/">
              <HomeScreen />
            </Route>
          </Switch>
        </userContext.Provider>
      </Router>
    </ChakraProvider>
  );
};
