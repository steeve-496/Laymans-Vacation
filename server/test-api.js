const http = require('http');

function fetchData(path) {
    return new Promise((resolve, reject) => {
        http.get('http://localhost:5000' + path, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        resolve(json);
                    } catch (e) {
                        reject('Failed to parse JSON');
                    }
                } else {
                    reject(`Status Code: ${res.statusCode}`);
                }
            });
        }).on('error', (err) => {
            reject(err.message);
        });
    });
}

async function test() {
    console.log("Testing API Endpoints...");

    try {
        console.log("1. Fetching Destinations...");
        const dests = await fetchData('/api/destinations');
        console.log(`✅ Success! Found ${dests.length} destinations.`);
    } catch (e) {
        console.error("❌ Failed to fetch Destinations:", e);
    }

    try {
        console.log("2. Fetching State Explorer...");
        const states = await fetchData('/api/state-explorer');
        console.log(`✅ Success! Found ${states.length} state entries.`);
    } catch (e) {
        console.error("❌ Failed to fetch State Explorer:", e);
        console.error("Possible Cause: Route not registered or Server not restarted.");
    }
}

test();
