const http = require('http');
const fs = require('fs');
const path = require('path');

// Zmienna przechowująca treść w pamięci (możesz zmienić na zapis do pliku .txt)
let savedContent = '';

const server = http.createServer((req, res) => {
    // Nagłówki CORS – pozwalają na komunikację między plikami
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // --- ENDPOINT: Pobierz treść (dla index.html) ---
    if (req.url === '/api/content' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: savedContent }));
        return;
    }

    // --- ENDPOINT: Zapisz treść (dla admin.html) ---
    if (req.url === '/api/content' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const json = JSON.parse(body);
                savedContent = json.content || '';
                console.log('📝 Nowa treść zapisana!');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Błąd JSON' }));
            }
        });
        return;
    }

    // --- Serwowanie plików statycznych (index.html, admin.html) ---
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json'
    };
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('404 – Nie znaleziono pliku');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Serwer działa na http://localhost:${PORT}`);
    console.log(`🌐 Strona główna: http://localhost:${PORT}/index.html`);
    console.log(`⚙️  Panel admina: http://localhost:${PORT}/admin.html`);
    console.log('📌 Aby zatrzymać serwer, naciśnij Ctrl+C');
});