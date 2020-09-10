import React from "react";
import "./App.css";

/**
 * Creates a custom stateful variable
 * @param {*} init The initial state
 */
const MakeStateful = (init) => {
  const [state, setState] = React.useState(init);
  return {
    getter: () => state,
    setter: setState,
    get value() {
      return state;
    },
    set value(newVal) {
      setState(newVal);
    },
  };
};

/**
 * Takes a list and splits it into sublists
 * @param {any[]} list The list to be split into sublists
 * @param {number} pieces How long should the sublists be
 */
const generateSublists = (list, pieces = 2) => list.reduce((acc, curr, index) => {
  if (index % pieces === 0) { // Push new sublist
    acc.push([curr]);
    return acc;
  }
  else { // Add to latest sublist
    const currSublist = acc.pop().concat(curr);
    acc.push(currSublist);
    return acc;
  }
}, []);

const randomHex = () => {
  const strength = Math.ceil(Math.random() * 50 + 180);
  return strength.toString(16);
}
const randomColour = () => `#${randomHex()}${randomHex()}${randomHex()}`;

const retrieveData = async (company) => {
  const url = `${process.env.REACT_APP_API_BASE_URL || ""}/${process.env.REACT_APP_DATA_PATH || "api"}?assignee=${company}`;
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

const expandSublist = (inventor) => <td key={inventor.name}><span className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
  <span className="pure-menu-link" style={{ backgroundColor: randomColour() }}>{inventor.name}</span>
  <ul className="pure-menu-children">
    {(inventor.twitter_username ? <li className="pure-menu-item">
      <a href={`https://twitter.com/${inventor.twitter_username}`} className="pure-menu-link">{inventor.twitter_username}{' '}<img className="inline-image" alt="Twitter" src="twitter.svg" /></a>
    </li> : null)}
    {inventor.concepts.map(concept => <li key={`${inventor.name}.${concept}`} className="pure-menu-item">
      <span className="pure-menu-link">{concept}</span>
    </li>)}
  </ul>
</span></td>;

/**
 * Generate an info blurb for the given details
 * @param {number} resultsNum The number of results returned
 * @param {string} companyName The name of the company
 */
const InfoBlurb = (resultsNum, companyName) => {
  if (companyName === "") return null;
  if (resultsNum === 0) return <p>No results were returned for assignee "{companyName}"</p>;
  return <React.Fragment>
    <h1>Inventors working for {companyName}</h1>
    <p>Hover over an inventor's name to see what concepts were involved in their inventions, and (if they have one), what's their Twitter account.</p>
  </React.Fragment>
}

function App() {
  const text = MakeStateful("");
  const resultQueryTerm = MakeStateful("");
  const response = MakeStateful([]);
  const loading = MakeStateful(false);
  const msg = MakeStateful(<React.Fragment />);
  const submitForm = async (event) => {
    event.preventDefault();
    loading.value = true;
    retrieveData(text.value).then(async (result) => {
      loading.value = false;
      if (result.ok) {
        const resultObj = await result.json();
        response.value = resultObj;
        msg.value = InfoBlurb(resultObj.length, resultQueryTerm.value);
      }
      else {
        response.value = [];
        if (result.status === 404) msg.value = <p>No results were returned for assignee "{resultQueryTerm.value}"</p>;
        else msg.value = <p>The API returned a response code of {result.status}</p>;
      }
    });
    resultQueryTerm.value = text.value;
    text.value = "";
  };
  return (
    <div className="App">
      <header className="App-header">
        <form
          className="pure-form"
          onSubmit={submitForm}
        >
          <input
            type="text"
            placeholder="Name of company"
            value={text.value}
            onChange={(event) => {
              text.value = event.target.value;
            }}
          />
          <button
            label="Search"
            onClick={submitForm}
          >
            Search
          </button>
        </form>
        {loading.value ? <span className="loader"></span> : InfoBlurb(response.value.length, resultQueryTerm.value)}
        <table style={{ paddingBottom: "15vh" }}><tbody>
          {generateSublists(response.value, /* Number of columns */3).map((sublist, index) => <tr key={index}>{sublist.map(expandSublist)}</tr>)}
        </tbody></table>
      </header>
    </div>
  );
}

export default App;
