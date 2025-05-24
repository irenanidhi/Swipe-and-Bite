import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
const envResult = dotenv.config();
if (envResult.error) {
  console.error('Error loading .env file:', envResult.error);
  process.exit(1);
}

// Log environment variables (without exposing the full API key)
console.log('Environment loaded:', {
  hasGeminiKey: !!process.env.GEMINI_API_KEY,
  nodeEnv: process.env.NODE_ENV,
  geminiKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'not set'
});

const app = express();
const port = 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

// Basic CORS configuration
app.use(cors());
app.use(express.json());

// Initialize Gemini
console.log('Initializing Gemini API...');
const geminiApiKey = process.env.GEMINI_API_KEY;
console.log('API Key present:', !!geminiApiKey);
if (!geminiApiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables!');
  process.exit(1);
}

let model;
try {
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });
  console.log('Gemini model initialized successfully');
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
  process.exit(1);
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  if (!model) {
    return res.status(500).json({ 
      error: 'AI model not initialized',
      details: 'The AI model failed to initialize properly'
    });
  }

  console.log('Received chat request:', {
    body: req.body,
    headers: req.headers
  });

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.log('Invalid messages format:', messages);
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1].content;
    console.log('Processing message:', lastUserMessage);

    try {
      // Create a prompt that includes the context
      const prompt = `You are a helpful food assistant. You can help with food recommendations, recipes, and any food-related questions. 
      Previous conversation: ${messages.slice(0, -1).map(msg => `${msg.role}: ${msg.content}`).join('\n')}
      User: ${lastUserMessage}
      Assistant:`;

      console.log('Sending prompt to Gemini...');
      // Generate content directly
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      const response = await result.response;
      const text = response.text();
      console.log('Received response from Gemini:', text);

      res.json({ 
        message: text
      });
    } catch (apiError) {
      console.error('Gemini API call failed:', {
        message: apiError.message,
        status: apiError.status,
        stack: apiError.stack,
        response: apiError.response?.data,
        code: apiError.code
      });
      throw apiError;
    }
  } catch (error) {
    console.error('Gemini API Error:', {
      message: error.message,
      status: error.status,
      stack: error.stack,
      response: error.response?.data,
      code: error.code
    });
    
    let errorMessage = 'Failed to get response from AI';
    let statusCode = 500;

    if (error.status === 400) {
      errorMessage = 'Invalid request. Please check your input.';
      statusCode = 400;
    } else if (error.status === 403) {
      errorMessage = 'API key does not have access to the requested resource.';
      statusCode = 403;
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
      statusCode = 429;
    }

    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.message,
      retryAfter: error.status === 429 ? 60 : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', {
    message: err.message,
    name: err.name,
    stack: err.stack
  });
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 