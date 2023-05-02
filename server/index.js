const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const ytdl = require('ytdl-core');
const summary = require('./summary');
const cors = require('cors');

//2. Initiate OpenAI Client
const main = (link, callback) => {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    // 3. Download the youtube video
    const videoStream = fs.createWriteStream('video.mp4');
    ytdl(link, { quality: 'lowest'}).pipe(videoStream);

    const transcribeStream = fs.createWriteStream('transcribe.txt');

    //4. When the download done, transcribe it
    videoStream.on("finish", async () => {
        const transcribe = await openai.createTranscription(
          fs.createReadStream("./video.mp4"),
          "whisper-1"
        );
        transcribeStream.write(transcribe.data.text);
        summary.main(transcribe.data.text);
    
        // Call the callback function with the transcribed text
        callback(transcribe.data.text);
      });
    };

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request body

app.post("/process-link", (req, res) => {
  const link = req.body.link;

main(link, (transcription) => {
    res.send(transcription);
  });
});


app.get('/', (req, res) => {
  res.send('Hello Worlds!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});