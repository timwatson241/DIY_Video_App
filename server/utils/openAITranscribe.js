// openaiTranscribe.js

const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const ytdl = require("ytdl-core");

const openaiTranscribe = async (link) => {
  const audioFilePath = "./resources/audio.mp3";
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  return new Promise((resolve) => {
    const audioStream = fs.createReadStream(audioFilePath);

    audioStream.on("open", async () => {
      const transcribe = await openai.createTranscription(
        audioStream,
        "whisper-1"
      );

      const videoInfo = await ytdl.getInfo(link);
      const videoTitle = videoInfo.videoDetails.title;

      // Create a JSON object with a similar structure as the Google one
      const openaiTranscriptionData = {
        source: "OpenAI",
        videoTitle: videoTitle,
        videoLink: link,
        transcript: transcribe.data.text,
      };

      // Resolve the promise with the JSON object
      resolve(openaiTranscriptionData);
      console.log("OpenAI transcription successful");
      // Save JSON to a file
      fs.writeFileSync(
        "./transcriptions/openai-transcription.json",
        JSON.stringify(openaiTranscriptionData)
      );
    });
  });
};

module.exports = openaiTranscribe;
