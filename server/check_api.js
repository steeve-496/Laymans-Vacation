const http = require('http');

function fetchData(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:5000/api${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error(`Error parsing JSON for ${path}:`, data.substring(0, 100));
                    resolve([]);
                }
            });
        }).on('error', (err) => {
            console.error(`Error fetching ${path}:`, err.message);
            resolve([]);
        });
    });
}

async function main() {
    console.log("Checking /destinations...");
    const dests = await fetchData('/destinations');
    console.log(`Destinations count: ${dests.length}`);
    if (dests.length > 0) console.log("First dest:", dests[0].name, "ID:", dests[0].id);

    console.log("\nChecking /packages...");
    const pkgs = await fetchData('/packages');
    console.log(`Packages count: ${pkgs.length}`);
    if (pkgs.length > 0) console.log("First pkg:", pkgs[0].title, "DestID:", pkgs[0].destinationId);
}

main();
