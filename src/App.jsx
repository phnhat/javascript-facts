import { useState, useEffect } from "react";
import "./App.css";
import jsFacts from "./facts/js-facts.json";
import { PREFERRED_LANG, DISMISSED_FACT } from "./chrome-storage";
import { getRandomFact } from "./utils";
/*global chrome*/

function App() {
  const [lang, setLang] = useState("en");
  const [dismissedFacts, setDismissedFacts] = useState([]);
  const [randomFact, setRandomFact] = useState(null);

  useEffect(() => {
    chrome.storage.local.get([PREFERRED_LANG], (result) => {
      if (result.preferredLang) {
        setLang(result.preferredLang);
        return;
      }
      setLang("en");
    });

    chrome.storage.local.get([DISMISSED_FACT], (result) => {
      setDismissedFacts(result.dismissedFact || []);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ dismissedFacts }, () => {});
    const fact = getRandomFact(jsFacts, dismissedFacts);
    setRandomFact(fact);
  }, [dismissedFacts]);

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    chrome.storage.local.set({ preferredLang: newLang });
  };

  const dismissFact = (factId) => {
    if (!factId) return;
    setDismissedFacts([...dismissedFacts, factId]);
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
