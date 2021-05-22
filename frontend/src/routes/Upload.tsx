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
import { UserContext, User } from "../contexts";

export const UploadScreen = () => {
  const [user, setUser] = React.useContext(UserContext);
  return !user ? (
    <Redirect to={"/login"} />
  ) : (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          {/* <Logo h="40vmin" pointerEvents="none" />
            <Text>
              Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
            </Text>
            <Link
              color="teal.500"
              href="https://chakra-ui.com"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn Chakra
            </Link> */}
          <Text>hau mau khau (Upload)</Text>
        </VStack>
      </Grid>
    </Box>
  );
};
