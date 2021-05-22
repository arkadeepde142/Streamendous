import * as React from "react";
import {
  Box,
  Text,
  // Link,
  VStack,
  // Code,
  Grid,
} from "@chakra-ui/react";
import { Redirect } from "react-router";
import {UserContext, User} from "../contexts"

export const ProfileScreen = () => {
  const [user, setUser] = React.useContext(UserContext)
  return !user?
  <Redirect to={"/login"}/>
  :(
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>      
            <Text>
              hau mau khau
            </Text>
          </VStack>
        </Grid>
      </Box>

  )};