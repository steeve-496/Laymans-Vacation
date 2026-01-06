async function testLogin() {
    console.log("Attempting login via script (127.0.0.1)...");
    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'steeve',
                password: 'admin123'
            })
        });

        console.log(`Status: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log("Login Success:", data);
        } else {
            const txt = await response.text();
            console.log("Login Failed:", txt);
        }
    } catch (e) {
        console.error("Network Error:", e);
    }
}

testLogin();
