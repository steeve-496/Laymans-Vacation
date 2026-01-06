async function verifyApi() {
    try {
        const dRes = await fetch('http://localhost:5000/api/destinations');
        const destinations = await dRes.json();
        const bhutan = destinations.find(d => d.name === 'Bhutan');

        if (!bhutan) {
            console.log("Bhutan destination missing from API.");
            return;
        }
        console.log(`Bhutan API ID: [${bhutan.id}]`);

        const sRes = await fetch('http://localhost:5000/api/state-explorer');
        const states = await sRes.json();
        console.log(`Total States API: ${states.length}`);

        if (states.length > 0) {
            const s = states[0];
            console.log(`Sample State DestID: [${s.destinationId}] (Type: ${typeof s.destinationId})`);
            console.log(`Bhutan ID Type: ${typeof bhutan.id}`);
        }

        const matches = states.filter(s => s.destinationId === bhutan.id);
        console.log(`Matches found: ${matches.length}`);

        if (matches.length === 0) {
            console.log("DUMPING ALL DEST IDS IN STATES:");
            states.forEach(s => console.log(`- ${s.name}: ${s.destinationId}`));
        } else {
            console.log("Matches found successfully.");
        }

    } catch (e) {
        console.log("Error:", e.message);
    }
}

verifyApi();
