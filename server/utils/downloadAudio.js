const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

async function downloadYouTubeAudio(link) {
  const outputFilename = "./resources/audio.mp3";
  return new Promise((resolve, reject) => {
    const stream = ytdl(link, { quality: "highestaudio" });

    const ffmpegCommand = ffmpeg(stream)
      .audioChannels(1)
      .audioFrequency(16000)
      .output(outputFilename)
      .on("error", (err) => {
        reject(err);
        console.error("Error downloading audio:", err);
      })
      .on("end", () => {
        resolve(outputFilename);
        console.log("Audio download successful");
      });

    ffmpegCommand.run();
  });
}

module.exports = downloadYouTubeAudio;
