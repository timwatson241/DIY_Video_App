require("dotenv").config();
const speech = require("@google-cloud/speech");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const ytdl = require("ytdl-core");
const fs = require("fs");

const speechClient = new speech.SpeechClient();

const googleTranscribe = async (link) => {
  const outputfilePath = "./resources/audio.mp3";

  const bucketName = "diy_video_app"; // Must exist in your Cloud Storage

  const uploadToGcs = async () => {
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });

    const bucket = storage.bucket(bucketName);
    const fileName = path.basename(outputfilePath);

    await bucket.upload(outputfilePath);

    return `gs://${bucketName}/${fileName}`;
  };

  const gcsUri = await uploadToGcs();
  const audio = {
    uri: gcsUri,
  };

  const config = {
    enableWordTimeOffsets: true,
    encoding: "MP3",
    sampleRateHertz: 48000,
    languageCode: "en-US",
  };

  const request = {
    audio,
    config,
  };

  const [operation] = await speechClient.longRunningRecognize(request);
  const [response] = await operation.promise();

  const transcriptionData = response.results.map((result) => {
    const transcript = result.alternatives[0].transcript;
    const words = result.alternatives[0].words.map((wordInfo) => {
      const startSecs =
        `${wordInfo.startTime.seconds}` +
        "." +
        wordInfo.startTime.nanos / 100000000;
      return { word: wordInfo.word, startTime: startSecs };
    });

    return { transcript, words };
  });

  const videoInfo = await ytdl.getInfo(link);
  const videoTitle = videoInfo.videoDetails.title;

  // Create JSON object with the desired structure
  const googleTranscriptionData = {
    source: "Google",
    videoTitle: videoTitle,
    videoLink: link,
    transcript: transcriptionData.map((result) => result.transcript).join(" "),
    words: transcriptionData.flatMap((result) => result.words),
  };
  console.log("Google transcription successful");
  fs.writeFileSync(
    "./transcriptions/google-transcription.json",
    JSON.stringify(googleTranscriptionData)
  );

  return googleTranscriptionData;
};

module.exports = googleTranscribe;
