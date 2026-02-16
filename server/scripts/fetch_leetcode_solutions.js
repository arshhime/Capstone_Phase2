
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const problemSchema = new mongoose.Schema({
    id: Number,
    title: String,
    optimalSolution: String
}, { collection: 'display-problems' });

const Problem = mongoose.model('Problem', problemSchema);

const BASE_URL = 'https://raw.githubusercontent.com/doocs/leetcode/main/solution';

// Helper to pad ID with zeros (e.g., 1 -> "0001")
function padId(id) {
    return id.toString().padStart(4, '0');
}

// Helper to determine the range folder (e.g., 1 -> "0000-0099")
function getRangeFolder(id) {
    const startNum = Math.floor(id / 100) * 100;
    const endNum = startNum + 99;
    return `${startNum.toString().padStart(4, '0')}-${endNum.toString().padStart(4, '0')}`;
}

async function fetchSolution(id, title) {
    const paddedId = padId(id);
    const rangeFolder = getRangeFolder(id);

    // Encode title: Spaces to %20, special chars maybe?
    // Doocs seems to just use spaces encoded.
    // Example: "Add Two Numbers" -> "Add%20Two%20Numbers"
    const encodedTitle = encodeURIComponent(title).replace(/'/g, '%27');

    const url = `${BASE_URL}/${rangeFolder}/${paddedId}.${encodedTitle}/Solution.py`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        // Retry with slightly different ID logic if needed or return null
        return null;
    }
}

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");

        // Find problems that don't have a proper solution yet (or just update all)
        const cursor = Problem.find({}).sort({ id: 1 }).cursor();

        let successCount = 0;
        let failCount = 0;

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            if (!doc.id) continue;

            process.stdout.write(`Processing ID ${doc.id}: ${doc.title}... `);

            const solution = await fetchSolution(doc.id, doc.title);

            if (solution) {
                doc.optimalSolution = solution;
                await doc.save();
                successCount++;
            } else {
                console.log(`Failed to fetch ID ${doc.id}: ${doc.title}`);
                failCount++;
            }

            // Small delay to be nice to GitHub if needed
            // await new Promise(r => setTimeout(r, 100)); 
        }

        console.log(`\nResults: ${successCount} updated, ${failCount} failed.`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
