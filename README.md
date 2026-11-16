# PolyPoth website
Static site, no build step.
1. Upload all files to a GitHub repo.
2. Settings > Pages > Deploy from branch > main / root.
3. Site: https://USERNAME.github.io/REPO/
4. QR code link for a batch: https://USERNAME.github.io/REPO/batch.html?id=PP-0001
Edit data.js to add or change batches. Replace example values with real lab results.

## AI assistant (Gemini)
The key must never be placed in the website files. Use the Cloudflare Worker proxy:
1. Get a free Gemini API key at https://aistudio.google.com
2. Cloudflare dashboard > Workers & Pages > Create Worker > paste worker.js > Deploy.
3. Worker Settings > Variables: add GEMINI_API_KEY (as a Secret) and ALLOWED_ORIGIN = https://USERNAME.github.io
4. Copy the worker URL into WORKER_URL at the top of chat.js, commit, done.
5. If the model name is retired, set GEMINI_MODEL (check the current name in AI Studio).
Edit the KB text inside worker.js to change what the assistant knows.
