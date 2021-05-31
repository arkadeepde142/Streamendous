import * as React from "react";
import {
  ChakraProvider,
  HStack,
  Text,
  Spacer,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  extendTheme,
  useStyleConfig,
  useColorMode,
  Container
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link as RouteLink,
} from "react-router-dom";
import {
  Search2Icon,
  BellIcon,
  PlusSquareIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { HomeScreen } from "./routes";
import { ProfileScreen } from "./routes";
import { UploadScreen } from "./routes";
import { PlayScreen } from "./routes";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Signup, Login } from "./routes";
import { User, UserContext } from "./contexts";
import userContext from "./contexts/UserContext";
import axios from "axios";
import theme from "./theme"
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
type NavLinkProps = { text?: string; path: string; icon?: React.ReactNode };
const NavLink = ({ text, path, icon }: NavLinkProps) => (
  <Button
    as={RouteLink}
    to={path}
    rounded="50%"
    variant="ghost"
    _focus={{ outline: "0px" }}
  >
    {text && <Text fontSize="xl">{text}</Text>}
    {icon}
  </Button>
);

const NavBar = ({
  user,
  setUser,
  size,
  variant
}: {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  size? : string;
  variant? : string;
}) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const styles = useStyleConfig("NavBar", {size, variant})
  return(
  <Container maxW="100vw" sx={styles}>
    <HStack spacing={[5, 10]} as="nav">
      <Flex borderRadius={10} w="30vw">
        <Input placeholder="Search" backgroundColor="#d3d3d3" _focus={{outline: "0px"}} _placeholder={{color : "brand.900"}} color={"brand.900"}/>
        <Button ml={3} _focus={{ outline: "0px" }}>
          {<Search2Icon w="5" h="5" />}
        </Button>
      </Flex>
      <Text fontFamily="fantasy" fontSize={"30"} fontWeight="bold" pt={3} color="brand.800">
        Streamendous
      </Text>
      <Spacer />
      <HStack>
        <NavLink path="/" icon={<ViewIcon w="5" h="5" />} />
        <NavLink path="/upload" icon={<PlusSquareIcon w="5" h="5" />} />
        {user && (
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  isActive={isOpen}
                  as={IconButton}
                  rounded="50%"
                  variant="ghost"
                  _focus={{ outline: "0px" }}
                  icon={<BellIcon w="5" h="5" />}
                />
                <MenuList>
                  <MenuItem onClick={() => alert("Kagebunshin")}>
                    Create a Copy
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        )}
        {/* <NavLink
            path="/profile"
            icon={ user? <Avatar name={`${user?.firstName} ${user?.lastName}`} /> : <Button >Login</Button>}
          /> */}
        <Button
          as={RouteLink}
          to="/profile"
          {...(user
            ? { variant:"avatar",
            _focus: { outline: "0px"},
            }
            : null)}
        >
          {user ? (
            <Avatar name={`${user?.firstName} ${user?.lastName}`} color="brand.500" background={colorMode === "light" ? "brand.900":"brand.300"} />
          ) : (
            <Text>Login</Text>
          )}
        </Button>
      </HStack>
      <ColorModeSwitcher/>
    </HStack>
  </Container>
);}


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
        console.log(error.response);
      }
    })();
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <userContext.Provider value={[user, setUser]}>
          <userContext.Consumer>
            {([user, setUser]) => <NavBar user={user} setUser={setUser} />}
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
