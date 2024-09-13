const qr = require('qr-image');
export default {
	async fetch(request, env, ctx) {
		if (request.method === 'POST') {
			return generateQRCode(request)
		}

		return new Response(landing, {
			headers: {
				"Content-Type": "text/html",
			}
		});
	},
};

async function generateQRCode(request) {
	const { text } = await request.json();
	const headers = { "Content-Type": "image/png" };
	const qr_png = qr.imageSync(text || "https://workers.dev");
	return new Response(qr_png, { headers });
}


const landing = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Generator</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #fef9f3;
    }

    .container {
      text-align: center;
      max-width: 90%;
      margin: auto;
    }

    h1 {
      font-size: 2em;
      margin-bottom: 0.5em;
    }

    p {
      margin-bottom: 1em;
    }

    input[type="text"] {
      width: 80%;
      padding: 0.5em;
      margin-bottom: 1em;
      font-size: 1em;
      border-radius: 4px;
    }

    .button-container {
    display: flex;
    justify-content: center;
    gap:5px;
    margin-bottom: 1em;
    border-radius: 4px;
    }

    button {
      padding: 0.5em 1em;
      font-size: 1em;
      cursor: pointer;
      border-radius: 4px;
    }

    .qr-container {
      display: inline-block;
      padding: 10px;
      // background: url('path/to/holographic.gif') center center / cover;
      border-radius: 8px;
      margin-bottom: 1em;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>QR Generator</h1>
    <p>Click the below button to generate a new QR code. .</p>
    <input type="text" id="text" placeholder="https://workers.dev"></input>
    <div class="button-container">
    <button onclick="generate()">Generate QR Code</button>
    <button id="download" style="display:none;" onclick="downloadQR()">Download</button>
    </div>
    <div class="qr-container">
      <img id="qr" src="#" />
    </div>
  </div>
  <script>
    function generate() {
      fetch(window.location.pathname, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: document.querySelector("#text").value })
      })
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = function () {
            const qrImage = document.querySelector("#qr");
            qrImage.src = reader.result;
            document.querySelector("#download").style.display = 'inline-block';
          }
          reader.readAsDataURL(blob);
        })
    }

    function downloadQR() {
      const qrImage = document.querySelector("#qr");
      const link = document.createElement('a');
      link.href = qrImage.src;
      link.download = 'qr_code.png';
      link.click();
    }
  </script>
</body>
</html>`