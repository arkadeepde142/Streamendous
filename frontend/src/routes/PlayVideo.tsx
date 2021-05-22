import * as React from "react";
import {
  Box,
  Text,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";

export const PlayScreen = () => (
  <Box textAlign="center" fontSize="xl">
    <Grid minH="100vh" p={3} templateColumns= "repeat(6, 1fr)" templateRows= "repeat(3, 1fr)" >
      <GridItem rowSpan={2} colSpan={4} rowStart={1} colStart={1}>
      <Flex ratio={16 / 9} align={"center"} marginTop={3.5} justifySelf={"center"} justifyContent={"center"}>
      {/* <AspectRatio maxW="650" ratio={16 / 9}> */}
        <video id="videoPlayer" width="850" controls muted autoPlay>
          <source src="http://localhost:5000/videos/60a24571e57d7c9e7b159014" type="video/mp4" />
        </video>
      {/* </AspectRatio> */}
      </Flex>
      </GridItem>
      <GridItem rowSpan={1} colSpan={4} rowStart={3} colStart={1}>
        <Text>Title of video</Text>
      </GridItem>
      <GridItem rowSpan={3} colSpan={2} borderLeftWidth={2}  rowStart={1} colStart={5}>
        <Text>Deskipsan</Text>
      </GridItem>
    </Grid>
  </Box>
);
