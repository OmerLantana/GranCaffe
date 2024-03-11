import dotenv from "dotenv";
dotenv.config();
import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';

import { parseString } from 'xml2js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export const codegeneratorController = async (req, res) => {
  const { instructions } = req.body;

  if (!instructions) {
    return res.status(400).json({ error: 'Instructions are required.' });
  }

  const API_KEY = process.env.OPENAI_API_KEY; // Replace with your OpenAI API key
  const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

  const htmlRegex = /```html\n([\s\S]*?)\n```/;
  const cssRegex = /```css\n([\s\S]*?)\n```/;
  const jsRegex = /```javascript\n([\s\S]*?)\n```/;

  try {
    const completionRequest = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are CodeGPT, an AI that translates instructions into code. You will always split the code you return into 3 segments: the html code (body section only), the css, and the javascript.',
        },
        { role: 'user', content: instructions },
      ],
      max_tokens: 2000,
      temperature: 0.05,
    };

    const response = await axios.post(API_ENDPOINT, completionRequest, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const codeString = response.data.choices[0].message.content;
    const htmlCode = codeString.match(htmlRegex)[1];
    const cssCode = codeString.match(cssRegex)[1];
    const jsCode = codeString.match(jsRegex)[1];

    return res.status(200).json({ htmlCode, cssCode, jsCode });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const youtubetitlesController = async (req, res) => {
  try {
    const { text } = req.body;

    // Improved prompt: Providing clearer instructions for the AI model
    const prompt = `Create Youtube video Tiltes .Do not generate explaination only titles on video Title \n\n${text}`;

    const { data } = await openai.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 800,
      temperature: 0.5,
    });

    if (data && data.choices && data.choices.length > 0) {
      // Find the best completion among the choices
      let bestCompletion = data.choices[0].text;

      // Filter out any irrelevant results by checking if the completion contains specific keywords
      // relevant to the JavaScript conversion
      const relevantKeywords = ['function', 'const', 'let', 'var', 'return', 'document', 'createElement'];

      for (let i = 0; i < data.choices.length; i++) {
        const completion = data.choices[i].text;
        if (relevantKeywords.some(keyword => completion.includes(keyword))) {
          bestCompletion = completion;
          break;
        }
      }

      return res.status(200).json({ answer: bestCompletion });
    }

    return res.status(500).json({ message: 'Conversion failed. Please try again.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};



export const paragraphController = async (req, res) => {
  try {
    const { text } = req.body;
    const { data } = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: `write a detail paragraph about \n${text}`,
      max_tokens: 500,
      temperature: 0,
    });
    if (data && data.choices[0].text) {
      return res.status(200).json({ answer: data.choices[0].text });
    } else {
      return res.status(500).json({ message: 'Error generating the paragraph. Please try again.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
export const articleController = async (req, res) => {
  try {
    const { text } = req.body;
    const { data } = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: `write a detail article on topic \n${text}. The article must have atleaste theree headings and should be fully Seo ranking`,
      max_tokens: 500,
      temperature: 0,
    });
    if (data && data.choices[0].text) {
      return res.status(200).json({ answer: data.choices[0].text });
    } else {
      return res.status(500).json({ message: 'Error generating the paragraph. Please try again.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const chatbotController = async (req, res) => {
  try {
    const { text } = req.body;
    const { data } = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: text,
      max_tokens: 500,
      temperature: 0,
    });
    if (data && data.choices[0].text) {
      return res.status(200).json({ answer: data.choices[0].text });
    } else {
      return res.status(500).json({ message: 'Error generating the paragraph. Please try again.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};


export const jsconverterController = async (req, res) => {
  try {
    const { text } = req.body;

    // Improved prompt: Providing clearer instructions for the AI model
    const prompt = `Please convert the following code into JavaScript:\n\n${text}`;

    const { data } = await openai.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 400,
      temperature: 0,
    });

    if (data && data.choices && data.choices.length > 0) {
      // Find the best completion among the choices
      let bestCompletion = data.choices[0].text;

      // Filter out any irrelevant results by checking if the completion contains specific keywords
      // relevant to the JavaScript conversion
      const relevantKeywords = ['function', 'const', 'let', 'var', 'return', 'document', 'createElement'];

      for (let i = 0; i < data.choices.length; i++) {
        const completion = data.choices[i].text;
        if (relevantKeywords.some(keyword => completion.includes(keyword))) {
          bestCompletion = completion;
          break;
        }
      }

      return res.status(200).json({ answer: bestCompletion });
    }

    return res.status(500).json({ message: 'Conversion failed. Please try again.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

import fetch from 'node-fetch'; // Make sure to import the 'node-fetch' library

export const visionController = async (req, res) => {
  try {
    // Extract the base64-encoded image data and user text from the request body.
    const base64Image = req.body.image;
    const userText = req.body.text;

    // Check if the image data or user text is not provided and return a 400 Bad Request error
    // if that's the case.
    if (!base64Image || !userText) {
      return res.status(400).json({ error: 'Image data or user text not received.' });
    }

    // Define the headers for the OpenAI API request, including the content type
    // and the authorization token.
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    };

    // Construct the payload for the OpenAI API.
    const payload = {
      model: "gpt-4-vision-preview",
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: userText // Use the user-provided text
        }, {
          type: "image_url",
          image_url: {
            // Attach the base64 image data to the request, formatted as a
            // data URL.
            url: `data:image/jpeg;base64,${base64Image}`
          }
        }]
      }],
      max_tokens: 300 // Set a limit on the number of tokens (words) the model should generate.
    };

    // Make an asynchronous POST request to the OpenAI API with the headers
    // and the JSON-stringified payload.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    // Parse the JSON response from the OpenAI API.
    const data = await response.json();

    // Send the parsed data back to the client with a 200 OK status.
    res.status(200).json(data);
  } catch (error) {
    // Log the error to the console and return a 500 Internal Server Error
    // status if something goes wrong.
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to process the image.' });
  }
};





export const ImageController = async (req, res) => {
  try {
    const { text } = req.body;
    const { data } = await openai.createImage({
      model: "dall-e-3",
      prompt: `${text}`,
      n: 1,
      size: "1024x1024",
    });

    if (data && data.data && data.data.length > 0 && data.data[0].url) {
      const imageUrl = data.data[0].url;

      // Fetch the image content and convert to base64
      const imageBuffer = await fetch(imageUrl).then((response) => response.buffer());
      const base64Image = imageBuffer.toString('base64');

      return res.status(200).json({ imageUrl, base64Image });
    } else {
      return res.status(500).json({ message: 'Error generating the image. Please try again.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Server Error',
    });
  }
};

export const keywordController = async (req, res) => {
  try {
    const { country, query } = req.query;

    if (!country || !query) {
      return res.status(400).json({ error: 'Country and query parameters are required.' });
    }

    const categories = {
      "Questions": ["who", "what", "where", "when", "why", "how", "are"],
      "Prepositions": ["can", "with", "for"],
      "Alphabet": Array.from("abcdefghijklmnopqrstuvwxyz"),
      "Comparisons": ["vs", "versus", "or"],
      "Intent-Based": ["buy", "review", "price", "best", "top", "how to", "why to"],
      "Time-Related": ["when", "schedule", "deadline", "today", "now", "latest"],
      "Audience-Specific": ["for beginners", "for students"],
      "Problem-Solving": ["solution", "issue", "error", "troubleshoot", "fix"],
      "Feature-Specific": ["with video", "with images", "analytics", "tools"],
      "Opinions/Reviews": ["review", "opinion", "rating"],
      "Cost-Related": ["price", "cost", "budget", "cheap", "expensive", "value"],
      "Trend-Based": ["trends", "new", "upcoming"]
    };

    const results = {};

    for (const category in categories) {
      results[category] = {};
      for (const keyword of categories[category]) {
        const apiUrl = generateApiUrl(country, query, category, keyword);
        const suggestions = await getSuggestions(apiUrl);
        results[category][keyword] = suggestions;
      }
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function getSuggestions(apiUrl) {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    const result = await parseXml(xmlData);

    return result.suggestions;
  } catch (error) {
    console.error(`Error fetching suggestions: ${error.message}`);
    return [];
  }
}

function generateApiUrl(country, query, category, keyword) {
  let modifiedQuery;

  if (["Questions", "Prepositions", "Intent-Based", "Time-Related", "Audience-Specific", "Problem-Solving", "Opinions/Reviews", "Cost-Related", "Trend-Based"].includes(category)) {
    modifiedQuery = `${keyword} ${query}`;
  } else if (["Alphabet", "Feature-Specific", "Industry-Specific"].includes(category)) {
    modifiedQuery = `${query} ${keyword}`;
  } else {
    modifiedQuery = `${keyword} ${query}`;
  }

  return `http://google.com/complete/search?output=toolbar&gl=${country}&q=${encodeURIComponent(modifiedQuery)}`;
}

async function parseXml(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, { ignoreAttributes: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const completeSuggestions = result?.toplevel?.CompleteSuggestion;

        if (completeSuggestions && Array.isArray(completeSuggestions)) {
          const suggestions = completeSuggestions.map((item) => {
            return item.suggestion[0].$.data;
          });

          resolve({ suggestions });
        } else {
          resolve({ suggestions: [] });
        }
      }
    });
  });
}
 
