import * as React from "react";
import {
  Box,
  Text,
  Link,
  VStack,
  Spinner,
  Container,
  Flex,
  HStack,
  Avatar,
  // Code,
} from "@chakra-ui/react";
import { UserContext } from "../contexts";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import theme from "../theme"
export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  ownerUserName: string;
  createdAt: Date;
}
export const HomeScreen = () => {
  const [page, setPage] = React.useState(1);
  const [videoArray, setVideoArray] = React.useState<VideoInfo[]>([]);
  const ref = React.useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = React.useState(false);
  const [overflown, setOverflown] = React.useState(false);
  const loadMore = React.useCallback(async () => {
    setPage((p) => p + 1);
    setIsFetching(true);
    const { data } = await axios.get("http://localhost:5000/videos/feed", {
      params: { page: page, limit: 1 },
    });
    console.log(data);
    setIsFetching(false);
    if ((data as Array<any>).length === 0) {
      setOverflown(true);
    }
    setVideoArray((array) => array.concat(data));
  }, [page]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      async (entities) => {
        // console.log(entities, overflown, isFetching)
        if (!isFetching && entities[0].isIntersecting && !overflown) {
          await loadMore();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, loadMore, isFetching, overflown]);

  const [user, setUser] = React.useContext(UserContext);
  return (
    <Flex fontSize="xl" flexDir="row">
      <Container bgColor="brand.2000" maxW="28vw" mt={15} borderRadius={15}> 
      <Text></Text>
      </Container>
      <VStack spacing={8} minW="70vw" justifySelf="flex-end" >
        {videoArray.map((item) => (
          <Link
            key={item.id}
            as={RouterLink}
            to={{
              pathname: "/play",
              state: item,
            }}
          >
            <Container mt={15} p={10} backgroundColor="brand.50" borderColor="brand.900" borderRadius={15} borderRightWidth={2} borderBottomWidth={2}>
              <HStack mb={3}>
                <Avatar src={"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"} />
              <Text textAlign="left" color="brand.900" fontWeight="extrabold"  >{item.ownerUserName}</Text>
              </HStack>
              <Text noOfLines={2} textAlign="left" color="brand.900" fontSize={15} mb={3}>{item.description}</Text>
            <VideoPlayer id={item.id} />
            <Text textAlign="left" color="brand.900" size="lg" mt={5}>{item.title}</Text>
            
            </Container>
          </Link>
        ))}
        <Box ref={ref}>{isFetching && <Spinner />}</Box>
      </VStack>
    </Flex>
  );
};

function VideoPlayer({ id }: { id: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    let result: Promise<void>;
    const observer = new IntersectionObserver(
      async (entities) => {
        // console.log(entities, overflown, isFetching)
        if (result) await result;

        if (entities[0].isIntersecting) {
          if (ref.current?.paused) {
            result = ref.current?.play();
          }
        } else {
          if (!ref.current?.paused) ref.current?.pause();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      }
    );

    if (ref && ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);
  return (
    
    <video id="videoPlayer" width="520" controls muted loop ref={ref}>
      <source src={`http://localhost:5000/videos/${id}`} type="video/mp4" />
    </video>

  );
}
