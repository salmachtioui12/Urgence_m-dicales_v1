const mongoose = require("mongoose");
const Ambulance = require("./Ambulance");

// 1. Schéma ambulance embarquée
const EmbeddedAmbulanceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, enum: ['A', 'B', 'C'], required: true }
}, { _id: false });

// 2. Schéma principal de l'hôpital
const HopitalSchema = new mongoose.Schema({
  osmId: Number,
  nom: { type: String, required: true },
  adresse: String,
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  ambulances: [EmbeddedAmbulanceSchema]
});

// 3. Middleware pour SAVE
HopitalSchema.post('save', async function(hopital) {
  console.log("✅ Middleware SAVE déclenché pour :", hopital.nom);
  await syncAmbulances(hopital);
});

// 4. Middleware pour FINDONEANDUPDATE
HopitalSchema.post('findOneAndUpdate', async function(result) {
  if (result) await syncAmbulances(result);
});

// 5. Fonction de synchronisation principale
async function syncAmbulances(hopital) {
  console.log("🔁 syncAmbulances appelée pour :", hopital.nom);
  if (!hopital?.ambulances) return;

  try {
    const ambulanceIds = hopital.ambulances.map(a => a.id);

    // Ajout / mise à jour des ambulances
    await Promise.all(hopital.ambulances.map(async (amb) => {
      await Ambulance.findOneAndUpdate(
        { id: amb.id, hopitalId: hopital._id },
        {
          type: amb.type,
          position: hopital.position,
          etat: "disponible",
          hopitalId: hopital._id
        },
        { upsert: true }
      );
    }));

    // 🔄 Suppression des ambulances supprimées
    const result = await Ambulance.deleteMany({
      hopitalId: hopital._id,
      id: { $nin: ambulanceIds }
    });

    console.log(`🔄 ${ambulanceIds.length} ambulances synchronisées pour ${hopital.nom}`);
    console.log(`🗑️ ${result.deletedCount} ambulances supprimées pour ${hopital.nom}`);
  } catch (err) {
    console.error("❌ Erreur synchro ambulances:", err);
  }
}

/* ------------------------------------------------------------------ */
/* 6.  MIDDLEWARE  :  cascade delete  des ambulances                  */
/* ------------------------------------------------------------------ */
HopitalSchema.post("findOneAndDelete", async function (doc) {
  // findByIdAndDelete déclenche ce middleware car c’est un alias de findOneAndDelete
  if (!doc) return; // rien à faire si l’hôpital n’existe pas

  try {
    const result = await Ambulance.deleteMany({ hopitalId: doc._id });
    console.log(
      `🗑️  ${result.deletedCount} ambulances supprimées (cascade) pour « ${doc.nom} »`
    );
  } catch (err) {
    console.error("❌ Erreur durant la suppression en cascade :", err);
  }
});

module.exports = mongoose.model("Hopital", HopitalSchema);