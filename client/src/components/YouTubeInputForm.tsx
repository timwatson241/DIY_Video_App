// src/components/YouTubeInputForm.tsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  Input,
  Button,
  Text,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import styles from "./YouTubeInputForm.module.css";
import axios from "axios";

interface YouTubeInputFormProps {
  onVideoSubmit: (videoUrl: string) => void;
  onTranscriptionReceived: (transcription: string) => void;
  setLoading: (loading: boolean) => void;
}

const YouTubeInputForm: React.FC<YouTubeInputFormProps> = ({
  onVideoSubmit,
  onTranscriptionReceived,
  setLoading,
}) => {
  const [videoUrl, setVideoUrl] = useState("");

  const processLink = async (url: string) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3004/process-link", {
        link: url,
      });
      console.log("Response from server:", response.data);
      onTranscriptionReceived(response.data);
    } catch (error) {
      console.error("Error processing link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (videoUrl) {
      onVideoSubmit(videoUrl);
      processLink(videoUrl);
      setVideoUrl("");
    }
  };

  return (
    <Box width="50%" textAlign="center" maxWidth="400px">
      <Heading fontSize="3xl" marginBottom={2}>
        DIY Magic
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="youtube-url">
          <InputGroup marginBottom={2} className={styles.inputFade}>
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=example"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" type="submit" mr={1.5}>
                Submit
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Text fontSize="md">
          Paste a youtube link into the box above to watch the magic happen
        </Text>
      </form>
    </Box>
  );
};

export default YouTubeInputForm;
