import { useState, useEffect } from "react";
import "./App.css";
import jsFacts from "./facts/js-facts.json";
import reactFacts from "./facts/react-facts.json";
import { chromeStorageKeys, defaultValue } from "./constant";
import { getRandomFact, filterFactsByCategories } from "./utils";
/*global chrome*/
const { PREFERRED_LANG, DISMISSED_FACT, CATEGORIES } = chromeStorageKeys;
const { DEFAULT_LANG, DEFAULT_CATEGORIES } = defaultValue;

function App() {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [dismissedFacts, setDismissedFacts] = useState([]);
  const [randomFact, setRandomFact] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    chrome.storage.local.get([PREFERRED_LANG], (result) => {
      setLang(result.preferredLang ?? DEFAULT_LANG);
    });

    chrome.storage.local.get([DISMISSED_FACT], (result) => {
      setDismissedFacts(result.dismissedFact ?? []);
    });

    chrome.storage.local.get([CATEGORIES], (result) => {
      setCategories(result.categories ?? DEFAULT_CATEGORIES);
    });
  }, []);

  useEffect(() => {
    const facts = filterFactsByCategories(
      [...jsFacts, ...reactFacts],
      categories
    );
    const fact = getRandomFact(facts, dismissedFacts);
    setRandomFact(fact);
  }, [dismissedFacts, categories]);

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    chrome.storage.local.set({ preferredLang: newLang });
  };

  const dismissFact = (factId) => {
    if (!factId) return;
    setDismissedFacts([...dismissedFacts, factId]);
    chrome.storage.local.set({ dismissedFacts: [...dismissedFacts, factId] });
  };

  return (
    <>
      <div className="language-selector">
        <select value={lang} onChange={handleLangChange}>
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
      </div>
      <h1>{randomFact.text[lang]}</h1>
      <h2>
        <a href={randomFact.source.href}>{randomFact.source.name}</a>
      </h2>
      <div className="card">
        <button onClick={dismissFact(randomFact.id)}>
          Don't show this fact again
        </button>
        <p></p>
      </div>
    </>
  );
}

export default App;
