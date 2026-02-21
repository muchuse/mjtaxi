// server.js
import express from "express";
import fetch from "node-fetch"; // npm install node-fetch@2
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser ton frontend à communiquer avec le serveur
app.use(cors());
app.use(express.json());

const ORS_API_KEY = "TA_CLE_ORS"; // <--- Mets ta vraie clé ici

// Endpoint pour géocodage
app.post("/geocode", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from OpenRouteService" });
  }
});

// Endpoint pour calculer la distance et le prix
app.post("/calculate", async (req, res) => {
  try {
    const { depart, destination } = req.body;
    if (!depart || !destination) return res.status(400).json({ error: "depart & destination required" });

    // Appel géocodage pour les deux adresses
    const geocode = async (text) => {
      const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data.features || data.features.length === 0) throw new Error("Adresse introuvable");
      return data.features[0].geometry.coordinates; // [lon, lat]
    };

    const departCoords = await geocode(depart);
    const destCoords = await geocode(destination);

    // Calcul de la distance via l'API directions d'ORS
    const directionsUrl = "https://api.openrouteservice.org/v2/directions/driving-car";
    const body = {
      coordinates: [departCoords, destCoords]
    };

    const directionsRes = await fetch(directionsUrl, {
      method: "POST",
      headers: {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const directionsData = await directionsRes.json();
    const distanceMeters = directionsData.routes[0].summary.distance; // en mètres
    const distanceKm = distanceMeters / 1000;

    // Tarification simple : 2€ par km + 5€ de base
    const price = 5 + distanceKm * 2;

    res.json({ distanceKm: distanceKm.toFixed(2), price: price.toFixed(2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
