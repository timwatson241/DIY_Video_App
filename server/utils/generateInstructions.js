// generateInstructions.js
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateInstructions(model = "text-davinci-003") {
  // Load the transcription data from the JSON files
  const googleTranscriptionData = JSON.parse(
    fs.readFileSync("./transcriptions/google-transcription.json")
  );
  const openaiTranscriptionData = JSON.parse(
    fs.readFileSync("./transcriptions/openai-transcription.json")
  );

  const instructions =
    "I'm giving you two transcripts of the same video below. The first is from Google Text to Speech and the second is from Open ai Whisper (which is more accurate). Read through both and then give me a summary of the text but as a sequence of number 'steps' that somebode could follow to complete the task. I'm also giving you the title for added context. Next, I'm giving you a list of word timestamps. These are the times in the audio at which each word is said. For each of the steps you return, I'd like you to provide the time at which that 'step' starts in the audio, based on the timestamp of the first word that was when speaking about the content of that step. Given the timestamps are for the words provided by Google which has some mistakes in the transcription, you may have to use the Open ai transcript to provide additional hints about what the correct words actually are. Don't interpolate the timestamps at all though, only give me timestamps that i've given you in the data below. If you can't figure out the timestamp that represents the start of the step, leave it black (reurn an empty string). Finally, i've provided a sample JSON and i'd like you respond in the exact same format. Do not provide anything else in your response including no summary";

  const videoTitle = `${googleTranscriptionData.videoTitle}`;

  const sampleJson = `{
    "steps": [
      {
        "order": 1,
        "timestamp": "0:07",
        "instruction": "Remove the wheel from the bike"
      },
      {
        "order": 2,
        "timestamp": "0:30",
        "instruction": "Take off the tyre from the wheel"
      }
    ]
  }`;

  prompt = `${instructions}
  \n\nGoogle Transcript: ${googleTranscriptionData.transcript}
  \n\nOpenAI Transcript: ${openaiTranscriptionData.transcript}
  \n\nTitle: ${videoTitle}
  \n\nGoogle Word timestamps: ${googleTranscriptionData.words}
  \n\nSample JSON: ${sampleJson}`;

  try {
    const completion = await openai.createCompletion({
      model: model,
      prompt: prompt,
      max_tokens: 1000, // Increase the number of tokens in the generated text
      n: 1, // Get only 1 completion
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      temperature: 0,
    });

    console.log("Completion successful");
    console.log("Generated Text:", completion.data.choices[0].text);
    const cleanedText = completion.data.choices[0].text
      .replace("Answer: ", "")
      .replace("Response: ", "");

    let parsedJson;
    try {
      parsedJson = JSON.parse(cleanedText);
      console.log("Parsed JSON");
      const jsonString = JSON.stringify(parsedJson, null, 2); // The second parameter is for a replacer function (we don't need it), and the third parameter is for indentation
      fs.writeFileSync("./completions/instructions.json", jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }

    return parsedJson;
  } catch (error) {
    console.error("Error getting completion from Open AI", error);
    return null;
  }
}

module.exports = generateInstructions;
