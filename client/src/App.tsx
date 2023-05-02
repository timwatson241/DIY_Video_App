// src/App.tsx
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import YouTubeInputForm from "./components/YouTubeInputForm";
import SkeletonLoader from "./components/skeletonLoader";
import ReactPlayer from "react-player";
import { Spinner } from "@chakra-ui/react";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);

  const handleVideoSubmit = (url: string) => {
    setVideoUrl(url);
    setShowForm(false);
    setLoadingVideo(true);
    console.log("Submitted YouTube URL:", url);
  };

  const handleNewVideo = () => {
    setVideoUrl("");
    setShowForm(true);
    setTranscription("");
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      paddingTop={60}
      width="100%"
    >
      {showForm ? (
        <YouTubeInputForm
          onVideoSubmit={handleVideoSubmit}
          onTranscriptionReceived={setTranscription}
          setLoading={setIsTranscriptLoading}
        />
      ) : (
        <Button mt={8} onClick={handleNewVideo}>
          Choose a new video
        </Button>
      )}

      {videoUrl && (
        <Box mt={8} width="100%" textAlign="center">
          <Flex flexDirection="column" alignItems="center">
            <Box position="relative" height="720px" width="1280px">
              {loadingVideo && <SkeletonLoader height="100%" width="100%" />}
              <ReactPlayer
                url={videoUrl}
                controls
                height="100%"
                width="100%"
                onReady={() => {
                  setLoadingVideo(false);
                }}
              />
            </Box>
          </Flex>

          <Text textAlign="center">{videoUrl}</Text>
          {isTranscriptLoading && (
            <Flex justifyContent="center" alignItems="center" mt={8}>
              <Spinner size="xl" />
            </Flex>
          )}
          {transcription && (
            <Flex margin={8}>
              <Text>{transcription}</Text>
            </Flex>
          )}
        </Box>
      )}
    </Flex>
  );
}

export default App;
