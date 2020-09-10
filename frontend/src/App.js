import React from "react";
import expandDataItem from "./dataExpander";
import apiCommunicator from "./apiCommunicator";
import InfoBlurb from "./infoBlurb";
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

function App() {
  const response = MakeStateful([]);
  const loading = MakeStateful(false);
  const msg = MakeStateful(<React.Fragment />);
  const submitForm = async (event) => {
    event.preventDefault();
    const text = event.target[0].value;
    event.target[0].value = "";
    if (text === "") return alert("Please enter a name."); // Don't try to send empty queries
    loading.value = true;
    const res = await apiCommunicator(text).catch(() => { msg.value = <p>Can't contact the API.</p>; return { ok: false } });
    loading.value = false;
    if (res.ok || res.status === 404) {
      const resultObj = res.status === 404 ? [] : await res.json();
      msg.value = InfoBlurb(resultObj.length, text);
      response.value = resultObj;
    }
    else {
      if (res.status) msg.value = <p>The API returned a response code of {res.status}</p>;
      response.value = [];
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Potato-Mashup <img src="logo.png" alt="logo" /></h1>
        <form className="pure-form" onSubmit={submitForm}>
          <input type="text" placeholder="Name of company" />
          <button className="pure-button pure-button-primary" label="Search" value="submit">
            Search
          </button>
        </form>
        {loading.value ? <span className="loader"></span> : msg.value}
        <div className="pure-g pure-menu-horizontal" style={{ width: "95vw", paddingBottom: "30vh" }}>
          {response.value.map(expandDataItem)}
        </div>
      </header>
    </div>
  );
}

export default App;
