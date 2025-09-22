import { useState, useEffect, useRef } from "react";
import "./App.css";
import jsFacts from "./facts/js-facts.json";
import reactFacts from "./facts/react-facts.json";
import cssFacts from "./facts/css-facts.json";
import { chromeStorageKeys, defaultValue } from "./constant";
import { getRandomFact, filterFactsByCategories } from "./utils";
import HighlightedText from "./components/HighlightedText.jsx";

/*global chrome*/
const { PREFERRED_LANG, DISMISSED_FACT, CATEGORIES } = chromeStorageKeys;
const { DEFAULT_LANG, DEFAULT_CATEGORIES } = defaultValue;

function App() {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [dismissedFacts, setDismissedFacts] = useState([]);
  const [randomFact, setRandomFact] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

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
      [...jsFacts, ...reactFacts, ...cssFacts],
      categories
    );
    const fact = getRandomFact(facts, dismissedFacts);
    setRandomFact(fact);
  }, [dismissedFacts, categories]);

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    chrome.storage.local.set({ [PREFERRED_LANG]: newLang });
  };

  const handleCategoryChange = (category) => (e) => {
    const newCategories = e.target.checked
      ? [...categories, category]
      : categories.filter((cat) => cat !== category);
    setCategories(newCategories);
    chrome.storage.local.set({ [CATEGORIES]: newCategories });
  };

  const dismissFact = () => {
    if (!randomFact) return;
    setDismissedFacts([...dismissedFacts, randomFact.id]);
    chrome.storage.local.set({
      [DISMISSED_FACT]: [...dismissedFacts, randomFact.id],
    });
  };

  const showCheckboxes = () => {
    if (!expanded) {
      ref.current.style.display = "block";
      setExpanded(true);
    } else {
      ref.current.style.display = "none";
      setExpanded(false);
    }
  };

  return (
    <>
      <div className="language-selector">
        <select
          value={lang}
          onChange={handleLangChange}
          className="lang-dropdown"
        >
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
        <form>
          <div className="multiselect">
            <div className="selectBox" onClick={showCheckboxes}>
              <select>
                <option>Select Categories</option>
              </select>
              <div className="overSelect"></div>
            </div>
            <div id="checkboxes" ref={ref}>
              {DEFAULT_CATEGORIES.map((category, index) => (
                <label key={index} htmlFor={category}>
                  <input
                    type="checkbox"
                    id={category}
                    checked={categories.includes(category)}
                    onChange={handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>
      {!randomFact && <h1>No more facts available!</h1>}
      {randomFact && (
        <>
          <HighlightedText
            text={randomFact.text[lang]}
            highlights={randomFact?.highlights?.[lang]}
          />
          <h2>
            <a href={randomFact.source.href}>{randomFact.source.name}</a>
          </h2>
        </>
      )}
      <div className="actions">
        <button onClick={dismissFact}>Don't show this fact again</button>
        <br />
        <a href="https://beacons.ai/voidspeaker">Buy me a boba 🧋</a>
      </div>
    </>
  );
}

export default App;
