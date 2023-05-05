// src/App.tsx
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Skeleton,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { useState } from "react";
import YouTubeInputForm from "./components/YouTubeInputForm";
import SkeletonLoader from "./components/skeletonLoader";
import ReactPlayer from "react-player";
import { Spinner } from "@chakra-ui/react";
import { InstructionStep } from "./types";

interface Transcription {
  steps: InstructionStep[];
}

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [transcription, setTranscription] = useState<Transcription | null>(
    null
  );

  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleVideoSubmit = (url: string) => {
    setVideoUrl(url);
    setShowForm(false);
    setLoadingVideo(true);
    console.log("Submitted YouTube URL:", url);
  };

  const handleNewVideo = () => {
    setVideoUrl("");
    setShowForm(true);
    setTranscription(null);
  };

  const handleNextStep = () => {
    setActiveTab(
      (prevActiveTab) =>
        (prevActiveTab + 1) % (transcription?.steps.length || 1)
    );
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      paddingTop={40}
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
        <>
          <Flex
            flexDirection="column"
            alignItems="center"
            mt={8}
            height="720px"
            width="1280px"
            position="relative"
          >
            {loadingVideo && <SkeletonLoader height="100%" width="100%" />}
            <ReactPlayer
              url={videoUrl}
              controls
              height="100%"
              width="100%"
              position="relative"
              onReady={() => {
                setLoadingVideo(false);
              }}
            />
          </Flex>

          <Text textAlign="center">{videoUrl}</Text>
          <Heading mt={8} textAlign="center">
            Summary
          </Heading>

          {isTranscriptLoading && (
            <Flex justifyContent="center" alignItems="center" mt={8}>
              <Spinner size="xl" />
            </Flex>
          )}
          {transcription && (
            <Flex margin={8}>
              <Tabs
                index={activeTab}
                onChange={(index) => setActiveTab(index)}
                isLazy
              >
                <TabList display="none">
                  {transcription.steps.map((step, index) => (
                    <Tab key={`tab-${index}`}>{step.instruction}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {transcription.steps.map((step, index) => (
                    <TabPanel key={`tabpanel-${index}`}>
                      <Text>
                        {step.order}. {step.instruction} (starts at{" "}
                        {step.timestamp})
                      </Text>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
              <Button mt={4} onClick={handleNextStep}>
                Next Step
              </Button>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
}

export default App;
