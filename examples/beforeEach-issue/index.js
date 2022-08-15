const express = require('express');
const http = require('http');
const { Verifier } = require('@pact-foundation/pact');

function waitForServerReady(server) {
  return new Promise((resolve, reject) => {
    server.on('listening', () => resolve(server));
    server.on('error', reject);
  });
}

function createApp() {
  const app = express();

  app.all('*', (req, res) => {
    console.log(`📦📦📦Incoming request: ${req.url}`)
    res.send()
  });

  return app;
}

function setupServer() {
  const app = createApp();
  return http.createServer(app).listen(0);
}

async function run() {
  let server = await waitForServerReady(setupServer());
  const proxyUrl = `http://localhost:${server.address().port}`;
  
  let verifier = new Verifier({
    pactUrls: ["no-state.json", "state.json"],
    providerBaseUrl: proxyUrl,
    beforeEach: (test) => {
      console.log("🎉🎉🎉🎉Before each")
    }
  })
  
  await verifier.verifyProvider();
}

run()
