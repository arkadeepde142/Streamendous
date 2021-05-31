import * as React from "react";
import {
  Box,
  Text,
  Link,
  VStack,
  Spinner,
  // Code,
} from "@chakra-ui/react";
import { UserContext } from "../contexts";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
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
    <Box textAlign="center" fontSize="xl">
      <VStack spacing={8}>
        {videoArray.map((item) => (
          <Link
            key={item.id}
            as={RouterLink}
            to={{
              pathname: "/play",
              state: item,
            }}
          >
            <VideoPlayer id={item.id} />
            <Text>{item.title}</Text>
            <Text noOfLines={2}>{item.description}</Text>
          </Link>
        ))}
        <Box ref={ref}>{isFetching && <Spinner />}</Box>
      </VStack>
    </Box>
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
    <video id="videoPlayer" width="700" controls muted loop ref={ref}>
      <source src={`http://localhost:5000/videos/${id}`} type="video/mp4" />
    </video>
  );
}
