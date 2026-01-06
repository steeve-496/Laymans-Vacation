async function testLogin() {
    console.log("Attempting login via script (fetch)...");
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'steeve',
                password: 'admin123'
            })
        });

        const data = await response.json();
        console.log(`Status: ${response.status}`);
        console.log("Response:", data);
    } catch (e) {
        console.error("Login Failed:", e);
    }
}

testLogin();
