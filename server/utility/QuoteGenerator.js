const safetyTips = [
  "Always keep your valuables secure and out of sight.",
  "Avoid carrying large amounts of cash; use credit or debit cards instead.",
  "Stay aware of your surroundings and be cautious in unfamiliar areas.",
  "Keep a copy of your passport and important documents in a separate location.",
  "Use reputable transportation services and avoid unlicensed taxis.",
  "Inform someone of your travel plans and check in regularly.",
  "Avoid walking alone at night, especially in poorly lit areas.",
  "Stay hydrated and protect yourself from extreme weather conditions.",
  "Learn basic phrases in the local language to ask for help if needed.",
  "Respect local customs and dress codes to avoid unwanted attention.",
  "Be cautious when sharing your travel plans with strangers.",
  "Use hotel safes to store valuable items when not in use.",
  "Keep emergency contact numbers and the address of your accommodation handy.",
  "Beware of common tourist scams and trust your instincts.",
  "Always lock your accommodation doors and windows.",
  "Avoid displaying expensive jewelry or electronics in public.",
  "Research your destination’s safety ratings and advisories before you go.",
  "Use anti-theft bags and accessories to protect your belongings.",
  "Stay informed about local news and potential safety risks.",
  "Know the location of the nearest embassy or consulate in case of emergencies.",
  "To travel best requires some time preparing for your visit to a particular location - that you don't travel anywhere without spending a few nights reading about the culture and history of the place you are visiting.",
  "Even a poor tour guide is entitled to some happiness.",
];

module.exports = async () => {
  const quote = Math.floor(Math.random(safetyTips.length) * 10);
  return safetyTips[quote];
};
