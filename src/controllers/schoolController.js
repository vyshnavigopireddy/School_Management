const db = require("../config/db");

// Add School API
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: "School added successfully!", schoolId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// List Schools API
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        const [schools] = await db.execute("SELECT * FROM schools");

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = (angle) => (angle * Math.PI) / 180;
            const R = 6371;
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        const sortedSchools = schools.map(school => ({
            ...school,
            distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
