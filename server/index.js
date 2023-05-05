// index.js
const express = require("express");
const app = express();
const port = 3004;

const cors = require("cors");

const downloadYouTubeAudio = require("./utils/downloadAudio");
const googleTranscribe = require("./utils/googleTranscribe");
const openAITranscribe = require("./utils/openAITranscribe");
const generateInstructions = require("./utils/generateInstructions");

require("dotenv").config();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request body

app.post("/process-link", async (req, res) => {
  const link = req.body.link;
  console.log("link received:", link);
  await downloadYouTubeAudio(link);

  try {
    // Run both transcriptions simultaneously and wait for their results
    const [googleTranscriptionData, openaiTranscriptionData] =
      await Promise.all([googleTranscribe(link), openAITranscribe(link)]);

    console.log("Google transcription data:", googleTranscriptionData);
    console.log("OpenAI transcription data:", openaiTranscriptionData);

    const generatedText = await generateInstructions();
    res.send(generatedText);
  } catch (err) {
    console.error("Error transcribing audio or video:", err);
    res
      .status(500)
      .send("An error occurred while transcribing audio or video.");
  }
});

app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
