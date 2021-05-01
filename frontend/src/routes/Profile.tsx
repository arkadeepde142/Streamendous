import * as React from "react";
import {
  Box,
  Text,
  // Link,
  VStack,
  // Code,
  Grid,
  theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

export const ProfileScreen = () => (

      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>      
            <Text>
              hau mau khau
            </Text>
          </VStack>
        </Grid>
      </Box>

  );