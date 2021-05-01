import * as React from "react";
import {
  Box,
  Text,
  Link,
  VStack,
  // Code,
  Grid,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Link as RouterLink } from "react-router-dom";
export const HomeScreen = () => (
  <Box textAlign="center" fontSize="xl">
    <Grid minH="100vh" p={3}>
      <ColorModeSwitcher justifySelf="flex-end" />
      <VStack spacing={8}>
        <Text>hau mau khau (home)</Text>
        <Link as={RouterLink} to="/play">
            <Text>Play the video</Text>
        </Link>
      </VStack>
    </Grid>
  </Box>
);
