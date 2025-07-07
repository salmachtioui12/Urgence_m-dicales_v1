let agents = [
  { id: 1, nom: "Agent 1", position: { lat: 33.5731, lng: -7.5898 } },
  { id: 2, nom: "Agent 2", position: { lat: 33.5800, lng: -7.6000 } },
];

function simulerDeplacement() {
  agents = agents.map(agent => {
    const deltaLat = (Math.random() - 0.5) * 0.001;
    const deltaLng = (Math.random() - 0.5) * 0.001;
    return {
      ...agent,
      position: {
        lat: agent.position.lat + deltaLat,
        lng: agent.position.lng + deltaLng,
      },
    };
  });
  console.log("📍 Positions des agents mises à jour");
}

function getAgents() {
  return agents;
}

module.exports = { simulerDeplacement, getAgents };