const express = require('express');
const levenshtein = require('fast-levenshtein');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Array
const constituentsData = [
  // North 24 Parganas
  { name: "Raigachhi", district: "North 24 Parganas" },
  { name: "Barasat", district: "North 24 Parganas" },
  { name: "Madhyamgram", district: "North 24 Parganas" },
  { name: "Kanchrapara", district: "North 24 Parganas" },
  { name: "Nanna", district: "North 24 Parganas" },
  { name: "Chakla", district: "North 24 Parganas" },
  { name: "Srotribati", district: "North 24 Parganas" },
  { name: "Jetia", district: "North 24 Parganas" },
  { name: "Halisahar", district: "North 24 Parganas" },
  { name: "Balibhara", district: "North 24 Parganas" },
  { name: "Naihati", district: "North 24 Parganas" },
  { name: "Noapara (P)", district: "North 24 Parganas" },
  { name: "Babanpur", district: "North 24 Parganas" },
  { name: "Teghari", district: "North 24 Parganas" },
  { name: "Bhatpara", district: "North 24 Parganas" },
  { name: "Panpur", district: "North 24 Parganas" },
  { name: "Kaugachhi", district: "North 24 Parganas" },
  { name: "Garshyamnagar", district: "North 24 Parganas" },
  { name: "Garulia", district: "North 24 Parganas" },
  { name: "Ichhapur Defence Estate", district: "North 24 Parganas" },
  { name: "North Barrackpur", district: "North 24 Parganas" },
  { name: "Barrackpur Cantonment", district: "North 24 Parganas" },
  { name: "Barrackpur", district: "North 24 Parganas" },
  { name: "Jafarpur", district: "North 24 Parganas" },
  { name: "Ruiya", district: "North 24 Parganas" },
  { name: "Titagarh", district: "North 24 Parganas" },
  { name: "Khardaha", district: "North 24 Parganas" },
  { name: "Bandipur", district: "North 24 Parganas" },
  { name: "Panihati", district: "North 24 Parganas" },
  { name: "Muragachha", district: "North 24 Parganas" },
  { name: "New Barrackpur", district: "North 24 Parganas" },
  { name: "Chandpur", district: "North 24 Parganas" },
  { name: "Talbandha", district: "North 24 Parganas" },
  { name: "Patulia", district: "North 24 Parganas" },
  { name: "Kamarhati", district: "North 24 Parganas" },
  { name: "Baranagar", district: "North 24 Parganas" },
  { name: "South Dum Dum", district: "North 24 Parganas" },
  { name: "North Dum Dum", district: "North 24 Parganas" },
  { name: "Dum Dum", district: "North 24 Parganas" },
  { name: "Rajarhat Gopalpur", district: "North 24 Parganas" },
  { name: "Bidhan Nagar", district: "North 24 Parganas" },
  { name: "Nabadiganta Industrial Township Authority (Salt Lake Sector V)", district: "North 24 Parganas" },
  { name: "West Bengal Housing Infrastructure Development Corp (New Town)", district: "North 24 Parganas" },

  // South 24 Parganas
  { name: "Joka", district: "South 24 Parganas" },
  { name: "Chata Kalikapur", district: "South 24 Parganas" },
  { name: "Ganye Gangadharpur", district: "South 24 Parganas" },
  { name: "Rameswarpur", district: "South 24 Parganas" },
  { name: "Asuti", district: "South 24 Parganas" },
  { name: "Hanspukuria", district: "South 24 Parganas" },
  { name: "Kalua", district: "South 24 Parganas" },
  { name: "Ramchandrapur", district: "South 24 Parganas" },
  { name: "Samali", district: "South 24 Parganas" },
  { name: "Maheshtala", district: "South 24 Parganas" },
  { name: "Uttar Raypur", district: "South 24 Parganas" },
  { name: "Balarampur", district: "South 24 Parganas" },
  { name: "Buita", district: "South 24 Parganas" },
  { name: "Benjanhari Acharial", district: "South 24 Parganas" },
  { name: "Abhirampur", district: "South 24 Parganas" },
  { name: "Nischintapur", district: "South 24 Parganas" },
  { name: "Birlapur", district: "South 24 Parganas" },
  { name: "Chak Kashipur", district: "South 24 Parganas" },
  { name: "Chak Alampur", district: "South 24 Parganas" },
  { name: "Bowali", district: "South 24 Parganas" },
  { name: "Dakshin Raypur", district: "South 24 Parganas" },
  { name: "Poali", district: "South 24 Parganas" },
  { name: "Pujali", district: "South 24 Parganas" },
  { name: "Budge Budge", district: "South 24 Parganas" },
  { name: "Daulatpur", district: "South 24 Parganas" },
  { name: "Bhasa", district: "South 24 Parganas" },
  { name: "Bishnupur", district: "South 24 Parganas" },
  { name: "Kanyanagar", district: "South 24 Parganas" },
  { name: "Nahazari", district: "South 24 Parganas" },
  { name: "Nadabhanga", district: "South 24 Parganas" },
  { name: "Kanganbaria", district: "South 24 Parganas" },
  { name: "Bora Gagangohalia", district: "South 24 Parganas" },
  { name: "Chanddandaha", district: "South 24 Parganas" },
  { name: "Barkalikapur", district: "South 24 Parganas" },
  { name: "Patharberia", district: "South 24 Parganas" },
  { name: "Ramkrishnapur", district: "South 24 Parganas" },
  { name: "Amtala", district: "South 24 Parganas" },
  { name: "Kriparampur", district: "South 24 Parganas" },
  { name: "Chak Enayetnagar", district: "South 24 Parganas" },
  { name: "Maricha", district: "South 24 Parganas" },
  { name: "Bhangar Raghunathpur", district: "South 24 Parganas" },
  { name: "Gobindapur", district: "South 24 Parganas" },
  { name: "Radhanagar", district: "South 24 Parganas" },
  { name: "Danga", district: "South 24 Parganas" },
  { name: "Bidyadharpur", district: "South 24 Parganas" },
  { name: "Kalikapur", district: "South 24 Parganas" },
  { name: "Chak Baria", district: "South 24 Parganas" },
  { name: "Sahebpur", district: "South 24 Parganas" },
  { name: "Rajpur Sonarpur", district: "South 24 Parganas" },
  { name: "Petua", district: "South 24 Parganas" },
  { name: "Garia", district: "South 24 Parganas" },
  { name: "Panchghara", district: "South 24 Parganas" },
  { name: "Mallikpur", district: "South 24 Parganas" },
  { name: "Hariharpur", district: "South 24 Parganas" },
  { name: "Champahati", district: "South 24 Parganas" },
  { name: "Solgohalia", district: "South 24 Parganas" },
  { name: "Naridana", district: "South 24 Parganas" },
  { name: "Salipur", district: "South 24 Parganas" },
  { name: "Khodar Bazar", district: "South 24 Parganas" },
  { name: "Komarhat", district: "South 24 Parganas" },
  { name: "Baruipur", district: "South 24 Parganas" },
  { name: "Raynagar", district: "South 24 Parganas" },
  { name: "Kalikapur Barasat", district: "South 24 Parganas" },
  { name: "Baharu", district: "South 24 Parganas" },
  { name: "Uttarparanij", district: "South 24 Parganas" },
  { name: "Alipur", district: "South 24 Parganas" },
  { name: "Uttar Durgapur", district: "South 24 Parganas" },
  { name: "Jaynagar Majilpur", district: "South 24 Parganas" },

  // Howrah
  { name: "Bally", district: "Howrah" },
  { name: "Jagadishpur", district: "Howrah" },
  { name: "Chamrail", district: "Howrah" },
  { name: "Eksara", district: "Howrah" },
  { name: "Chakapara", district: "Howrah" },
  { name: "Haora", district: "Howrah" },
  { name: "Khalia", district: "Howrah" },
  { name: "Bankra", district: "Howrah" },
  { name: "Nibra", district: "Howrah" },
  { name: "Mahiari", district: "Howrah" },
  { name: "Bipra Noapara", district: "Howrah" },
  { name: "Ankurhati", district: "Howrah" },
  { name: "Kantlia", district: "Howrah" },
  { name: "Salap", district: "Howrah" },
  { name: "Tentulkuli", district: "Howrah" },
  { name: "Argari", district: "Howrah" },
  { name: "Andul", district: "Howrah" },
  { name: "Jhorhat", district: "Howrah" },
  { name: "Hatgachha", district: "Howrah" },
  { name: "Dhuilya", district: "Howrah" },
  { name: "Panchpara", district: "Howrah" },
  { name: "Podara", district: "Howrah" },
  { name: "Banupur", district: "Howrah" },
  { name: "Sankrail", district: "Howrah" },
  { name: "Manikpur", district: "Howrah" },
  { name: "Sarenga", district: "Howrah" },
  { name: "Raghudebbati", district: "Howrah" },
  { name: "Nalpur", district: "Howrah" },
  { name: "Uluberia", district: "Howrah" },
  { name: "Chak Srikrishna", district: "Howrah" },
  { name: "Khalisani", district: "Howrah" },
  { name: "Uttar Pirpur", district: "Howrah" },
  { name: "Balarampota", district: "Howrah" },
  { name: "Santoshpur", district: "Howrah" },
  { name: "Domjur", district: "Howrah" },
  { name: "Dakshin Jhapardaha", district: "Howrah" },
  { name: "Makardaha", district: "Howrah" },
  { name: "Khantora", district: "Howrah" },
  { name: "Bhandardaha", district: "Howrah" },
  { name: "Kamranga", district: "Howrah" },
  { name: "Jaypur Bil", district: "Howrah" }
];

// Search API Endpoint
app.get('/api/search', (req, res) => {
  const query = req.query.place?.trim();

  if (!query) {
    return res.status(400).json({ result: "Please provide a place name." });
  }

  const queryLower = query.toLowerCase();

  // 1. Exact Match
  const exactMatch = constituentsData.find(item => item.name.toLowerCase() === queryLower);
  if (exactMatch) {
    return res.json({ result: `within ${exactMatch.district}` });
  }

  // 2. Partial Substring Matches
  const partials = constituentsData.filter(item => item.name.toLowerCase().includes(queryLower));
  if (partials.length > 0) {
    return res.json({ result: `within ${partials[0].district}` });
  }

  // 3. Fuzzy Typo Match (Levenshtein)
  const fuzzy = constituentsData
    .map(item => ({ ...item, dist: levenshtein.get(queryLower, item.name.toLowerCase()) }))
    .sort((a, b) => a.dist - b.dist)[0];

  if (fuzzy && fuzzy.dist <= 3) {
    return res.json({ result: `within ${fuzzy.district}` });
  }

  // Fallback
  return res.json({ result: "not within any of this three districts" });
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));