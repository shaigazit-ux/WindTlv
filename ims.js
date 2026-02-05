export default async function handler(req, res) {  
// Enable CORS  
res.setHeader('Access-Control-Allow-Credentials', true);  
res.setHeader('Access-Control-Allow-Origin', '\*');  
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');  
res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

// Handle preflight  
if (req.method === 'OPTIONS') {  
res.status(200).end();  
return;  
}

const { stationId } = req.query;  
  
if (!stationId) {  
return res.status(400).json({ error: 'Station ID required' });  
}

try {  
const response = await fetch(\`https://api.ims.gov.il/v1/envista/stations/${stationId}/data/latest\`, {  
headers: {  
'Authorization': \`ApiToken ${process.env.IMS\_API\_KEY}\`,  
'Accept': 'application/json',  
'Content-Type': 'application/json'  
}  
});

if (!response.ok) {  
throw new Error(\`IMS API error: ${response.status}\`);  
}

const data = await response.json();  
res.status(200).json(data);  
} catch (error) {  
console.error('Proxy error:', error);  
res.status(500).json({ error: error.message });  
}  
}