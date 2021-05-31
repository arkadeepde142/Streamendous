import * as React from "react";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text
} from "@chakra-ui/react";
import { Redirect } from "react-router";
import { UserContext, User } from "../contexts";
import axios from "axios";

export interface VideoForm {
  title: string;
  description: string;
  video: string;
}

export const UploadScreen = () => {
  const [file, setFile] = React.useState<File>();
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [completeBar, setCompleteBar] = React.useState(0);
  const [user, setUser] = React.useContext(UserContext);

  return !user ? (
    <Redirect to={"/login"} />
  ) : (
    <Flex
      fontSize="xl"
      minH="100vh"
      minW={"100vw"}
      p={30}
      alignItems="flex-start"
      justifyContent="center"
      flexDirection="column"
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // console.log(file,title, description);
          const formData = new FormData();
          formData.append("title", title)
          formData.append("description", description);
          const blob : Blob = new Blob([new Uint8Array(await file!.arrayBuffer())], {type: file!.type}) 
          formData.append("video", blob)
          axios.post("http://localhost:5000/videos/",formData, {
            headers: { Authorization: `Bearer ${user?.token}` },
            withCredentials: true,
            onUploadProgress: (progressEvent:ProgressEvent)=>{setCompleteBar(Math.floor((progressEvent.loaded/progressEvent.total)*100))}
          })
        }}
      >
        <FormControl isRequired>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            placeholder="video title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input
            id="description"
            placeholder="video description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="video">Video</FormLabel>
          <Input
            id="video"
            type="file"
            onChange={(e) => {
              if (e.target.files) setFile(e.target.files[0]);
            }}
          />
        </FormControl>
        <Button type="submit" w="full" mt = {[5,10]}  color="brand.800"
                  variant="outline"
                  outline="2px">
          Upload
        </Button>
      </form>
      <Text mt={10}>
          {completeBar}
      </Text>
    </Flex>
  );
};
