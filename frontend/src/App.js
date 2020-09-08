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
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
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

function App() {
  const text = MakeStateful("");
  const response = MakeStateful([]);
  const loading = MakeStateful(false);
  const submitForm = (event) => {
    event.preventDefault();
    loading.value = true;
    retrieveData(text.value).then((result) => {
      loading.value = false;
      if (result) response.value = result;
    });
    text.value = "";
  };
  return (
    <div className="App">
      <header className="App-header">
        <form
          className="pure-form"
          onSubmit={(event) => {
            submitForm(event);
          }}
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
            onClick={(event) => {
              submitForm(event, { assignee: text.value });
            }}
          >
            Search
          </button>
        </form>
        <span className="loader" style={{visibility: loading.value ? "visible" : "hidden"}}></span>
        <table style={{paddingBottom: "15vh"}}>
          {generateSublists(response.value, 3).map((sublist, index) => <tr key={index}>{sublist.map(expandSublist)}</tr>)}
        </table>
      </header>
    </div>
  );
}

export default App;
