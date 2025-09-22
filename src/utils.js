export const getRandomFact = (facts, dismissedFacts = []) => {
  const availableFacts = facts.filter(
    (fact) => !dismissedFacts.includes(fact.id)
  );
  if (availableFacts.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableFacts.length);
  return availableFacts[randomIndex];
};

export const filterFactsByCategories = (facts, categories = []) => {
  if (categories.length === 0) return facts;
  return facts.filter((fact) => categories.includes(fact.id.split('-')[0]));
}
