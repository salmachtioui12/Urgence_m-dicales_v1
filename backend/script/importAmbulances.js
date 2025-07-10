const mongoose = require("mongoose");
const Hopital = require("../models/Hopital");
const Ambulance = require("../models/Ambulance");

mongoose.connect("mongodb://localhost:27017/hopitaux", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importerAmbulances() {
  const hopitaux = await Hopital.find();

  for (const h of hopitaux) {
    if (Array.isArray(h.ambulances)) {
      for (const a of h.ambulances) {
        const dejaExiste = await Ambulance.findOne({ id: a.id, hopitalId: h._id });
        if (!dejaExiste) {
          await Ambulance.create({
            id: a.id,
            type: a.type,
            hopitalId: h._id,
            position: h.position,
            etat: "disponible",
          });
        }
      }
    }
  }

  console.log("✅ Import terminé.");
  mongoose.disconnect();
}

importerAmbulances();
