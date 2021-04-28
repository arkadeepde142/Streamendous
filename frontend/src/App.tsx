import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  // Link,
  VStack,
  // Code,
  Grid,
  theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
// import { Logo } from "./Logo";
import { AspectRatio } from "@chakra-ui/react";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <AspectRatio maxW="560px" ratio={4/3}>
        <video id="videoPlayer" width="650" controls muted autoPlay>
           <source src="http://localhost:5000/videos" type="video/mp4" />
       </video>
          </AspectRatio>
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

          {/* <AspectRatio maxW="560px" ratio={1}>
            <iframe
              title="naruto"
              src="https://www.youtube.com/embed/QhBnZ6NPOY0"
              allowFullScreen
            />
          </AspectRatio> */}
          
          <Text>
            hau mau khau
          </Text>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
);
