//summary.js
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const fs = require('fs');

const main = async (text) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const summaryStream = fs.createWriteStream('summary.txt');

    const prompt = `Please summary this text: ${text}`

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", "content": prompt}]
    });
    //6. Store the summarize text to .txt file
    summaryStream.write(completion.data.choices[0].message.content)
}

module.exports = {
    main
}
