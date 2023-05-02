// src/App.tsx
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import YouTubeInputForm from "./components/YouTubeInputForm";
import ReactPlayer from "react-player";
import { Spinner } from "@chakra-ui/react";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [transcription, setTranscription] = useState("");

  const handleVideoSubmit = (url: string) => {
    setVideoUrl(url);
    setShowForm(false);
    setLoadingVideo(true);
    console.log("Submitted YouTube URL:", url);
  };

  const handleNewVideo = () => {
    setVideoUrl("");
    setShowForm(true);
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      paddingTop={60}
    >
      {showForm ? (
        <YouTubeInputForm
          onVideoSubmit={handleVideoSubmit}
          onTranscriptionReceived={setTranscription}
        />
      ) : (
        <Button mt={8} onClick={handleNewVideo}>
          Choose a new video
        </Button>
      )}
      {videoUrl && (
        <Box mt={8} position="relative">
          {loadingVideo && (
            <>
              <Flex
                position="absolute"
                zIndex={1}
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner size="xl" />
              </Flex>
            </>
          )}
          <ReactPlayer
            url={videoUrl}
            controls
            onReady={() => {
              setLoadingVideo(false);
            }}
          />
          <Text textAlign="center">{videoUrl}</Text>
          {transcription && (
            <Box mt={8}>
              <Text whiteSpace="pre-wrap">{transcription}</Text>
            </Box>
          )}
        </Box>
      )}
    </Flex>
  );
}

export default App;
