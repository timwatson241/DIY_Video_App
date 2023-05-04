// openaiTranscribe.js

const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const ytdl = require("ytdl-core");

const main = async (link) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Download the youtube video
  const videoStream = fs.createWriteStream("video.mp4");
  ytdl(link, { quality: "lowest" }).pipe(videoStream);

  const transcribeStream = fs.createWriteStream("transcribe.txt");

  return new Promise((resolve) => {
    videoStream.on("finish", async () => {
      const transcribe = await openai.createTranscription(
        fs.createReadStream("./video.mp4"),
        "whisper-1"
      );
      transcribeStream.write(transcribe.data.text);

      // Resolve the promise with the transcribed text
      resolve(transcribe.data.text);
    });
  });
};

module.exports = main;
