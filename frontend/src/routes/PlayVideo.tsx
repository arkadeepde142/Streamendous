import * as React from "react";
import {
  Box,
  Text,
  // Link,
  VStack,
  Grid,
  AspectRatio,
  Center,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

export const PlayScreen = () => (
  <Box textAlign="center" fontSize="xl">
    <Grid minH="100vh" p={3}>
      <ColorModeSwitcher justifySelf="flex-end" />
      <Center w="650" ratio={16 / 9}>
      {/* <AspectRatio maxW="650" ratio={16 / 9}> */}
        <video id="videoPlayer" width="650" controls muted autoPlay>
          <source src="http://localhost:5000/videos" type="video/mp4" />
        </video>
      {/* </AspectRatio> */}
      </Center>
      <VStack spacing={8}>
        <Text>hau mau khau (play screen)</Text>
      </VStack>
    </Grid>
  </Box>
);
