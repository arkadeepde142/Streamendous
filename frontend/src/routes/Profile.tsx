import * as React from "react";
import {
  Box,
  Text,
  // Link,
  HStack,
  // Code,
  Grid,
  Button,
  Spacer,
  Image
} from "@chakra-ui/react";
import { Redirect } from "react-router";
import {UserContext, User} from "../contexts"
import axios from "axios";

export const ProfileScreen = () => {
  const [user, setUser] = React.useContext(UserContext)
  return !user?
  <Redirect to={"/login"}/>
  :(
      <Box textAlign="center" fontSize="xl">
          <HStack spacing={8} maxW="95vw" mt={10}>   
          <Spacer/>
          {user && (
        <Button
          colorScheme="yellow"
          _focus={{outline: "0px"}}
          mt={[2, 4]}
          color="brand.700"
          variant="outline"
          outline="2px"
          onClick={async () => {
            await axios.post(
              "http://localhost:5000/auth/logout",
              {},
              {
                headers: { Authorization: `Bearer ${user?.token}` },
                withCredentials: true,
              }
            );
            setUser(null);
          }}
        >
          Logout
        </Button>
      )}   
            <Text>
              {user.username}
            </Text>
          </HStack>
          {/* <Image justifySelf="center" alignSelf="center" src={"https://images.pexels.com/photos/5543535/pexels-photo-5543535.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"} w="25vw" h="30vw" borderRadius="full"  /> */}
      </Box>

  )};