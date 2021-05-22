import * as React from "react";
import {
  Box,
  Text,
  Link,
  VStack,
  // Code,
  Grid,
} from "@chakra-ui/react";
import {UserContext} from "../contexts"
import { Link as RouterLink } from "react-router-dom";
export const HomeScreen = () => {
  const [user, setUser] = React.useContext(UserContext)
  return(
  <Box textAlign="center" fontSize="xl">
    <Grid minH="100vh" p={3}>
      <VStack spacing={8}>
        <Text>{user?.username}</Text>
        <Link as={RouterLink} to="/play">
            <Text>Play the video</Text>
        </Link>
      </VStack>
    </Grid>
  </Box>
);}
