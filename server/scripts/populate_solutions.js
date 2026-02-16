
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configuration
const MONGO_URI = process.env.MONGO_URI;
const GEMINI_API_KEY = process.env.GEMINI_API;
const DELAY_MS = 4000; // 4 seconds delay between requests

if (!MONGO_URI || !GEMINI_API_KEY) {
    console.error("Missing MONGO_URI or GEMINI_API in .env");
    process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Define Schema
const problemSchema = new mongoose.Schema({
    title: String,
    description: String,
    optimalSolution: String,
    timeComplexity: String,
    spaceComplexity: String
}, { collection: 'display-problems' });

const Problem = mongoose.model('Problem', problemSchema);

const SYSTEM_PROMPT = `
You are an expert coding interview assistant. 
For the given coding problem, provide the following in strictly valid JSON format:
1. "optimalSolution": A clean, well-commented Python solution.
2. "timeComplexity": The Big O time complexity (e.g., "O(n)").
3. "spaceComplexity": The Big O space complexity (e.g., "O(1)").

Do NOT include Markdown formatting (like \`\`\`json). Just the raw JSON string.
`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateSolutionWithRetry(title, description, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const prompt = `
            Problem Title: ${title}
            Description: ${description}

            Provide the optimal Python solution and complexities.
            `;

            const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
            const response = await result.response;
            let text = response.text();

            // Clean markdown if present
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (error) {
            if (error.status === 429 || error.message.includes('429')) {
                const waitTime = (i + 1) * 10000; // 10s, 20s, 30s
                console.warn(`  !! Rate limit (429) for "${title}". Retrying in ${waitTime / 1000}s...`);
                await sleep(waitTime);
            } else {
                console.error(`  !! Error generating for "${title}":`, error.message);
                return null; // Non-retriable error
            }
        }
    }
    console.error(`  !! Failed after ${retries} retries for "${title}".`);
    return null;
}

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");

        const query = {
            $or: [
                { optimalSolution: { $exists: false } },
                { optimalSolution: "AI will generate this..." },
                { timeComplexity: { $exists: false } }
            ]
        };

        const total = await Problem.countDocuments(query);
        console.log(`Found ${total} problems to update.`);

        // Use cursor for efficient memory usage
        const cursor = Problem.find(query).cursor();
        let count = 0;
        let success = 0;

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            count++;
            console.log(`[${count}/${total}] Processing: ${doc.title}`);

            const data = await generateSolutionWithRetry(doc.title, doc.description);

            if (data) {
                doc.optimalSolution = data.optimalSolution;
                doc.timeComplexity = data.timeComplexity;
                doc.spaceComplexity = data.spaceComplexity;

                await doc.save();
                success++;
                console.log(`  -> Updated: Time: ${data.timeComplexity}, Space: ${data.spaceComplexity}`);
            }

            // Respect rate limits
            await sleep(DELAY_MS);

            if (count % 25 === 0) {
                console.log(`\n============== PROGRESS UPDATE: ${count}/${total} ==============\n`);
            }
        }

        console.log(`\nCompleted! Successfully updated ${success} problems.`);

    } catch (error) {
        console.error("Script Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

main();
