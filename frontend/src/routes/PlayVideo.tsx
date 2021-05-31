import * as React from "react";
import { Box, Text, Grid, GridItem, Flex, VStack } from "@chakra-ui/react";
import { useLocation } from "react-router";
import axios from "axios";
import {VideoInfo} from "./Home"

export const PlayScreen = () => {
  const location = useLocation<VideoInfo>();
  console.log(location);
  const { id, title, description, ownerUserName } = location.state;
  // const [videoResponse, setVideoResponse] = React.useState<VideoInfo>();
  // React.useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/videos/info/${id}`
  //       );
  //       setVideoResponse(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }, []);
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid
        minH="100vh"
        p={3}
        templateColumns="repeat(6, 1fr)"
        templateRows="repeat(3, 1fr)"
      >
        <GridItem rowSpan={2} colSpan={4} rowStart={1} colStart={1}>
          <Flex
            ratio={16 / 9}
            align={"center"}
            marginTop={3.5}
            justifySelf={"center"}
            justifyContent={"center"}
          >
            {/* <AspectRatio maxW="650" ratio={16 / 9}> */}
            <video id="videoPlayer" width="850" controls muted autoPlay>
              <source
                src={`http://localhost:5000/videos/${id}`}
                type="video/mp4"
              />
            </video>
            {/* </AspectRatio> */}
          </Flex>
        </GridItem>
        <GridItem rowSpan={1} colSpan={4} rowStart={3} colStart={1}>
          <Text
            textAlign="left"
            m={[3, 6]}
            p={[2, 4]}
            borderBottomWidth={1}
            w="80%"
          >
            {title}
          </Text>
        </GridItem>
        <GridItem
          rowSpan={3}
          colSpan={2}
          borderLeftWidth={2}
          rowStart={1}
          colStart={5}
        >
          <VStack>
            <Text
              textAlign="left"
              m={[2, 4]}
              p={[2, 4]}
              borderBottomWidth={1}
              w="80%"
            >
              {ownerUserName}
            </Text>
            <Text alignSelf={"flex-start"} m={[2, 4]} p={[2, 4]}>
              {description}
            </Text>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};
