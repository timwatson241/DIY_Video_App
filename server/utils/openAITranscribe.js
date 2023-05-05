const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const ytdl = require("ytdl-core");

const main = async (link) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const audioFilePath = "./resources/audio.mp3";

  try {
    const videoInfo = await ytdl.getInfo(link);
    const videoTitle = videoInfo.videoDetails.title;

    const transcribe = await openai.createTranscription(
      fs.createReadStream(audioFilePath),
      "whisper-1"
    );

    console.log("OpenAI transcription successful");

    // Create JSON object with the desired structure
    const openaiTranscriptionData = {
      source: "OpenAI",
      videoTitle: videoTitle,
      videoLink: link,
      transcript: transcribe.data.text,
    };

    fs.writeFileSync(
      "./transcriptions/openai-transcription.json",
      JSON.stringify(openaiTranscriptionData)
    );

    // Return the transcribed text
    return transcribe.data.text;
  } catch (error) {
    console.error("Error during OpenAI transcription:", error);
    throw error;
  }
};

module.exports = main;
