import React from "react";
import BubbleChart from '@weknow/react-bubble-chart-d3';
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

const randomHex = () => Math.ceil(Math.random() * 128 + 128).toString(16);
const randomColour = () => `#${randomHex()}${randomHex()}${randomHex()}`;

const retrieveData = async (params) => {
  const url = `${process.env.REACT_APP_API_BASE_URL || ""}/${process.env.REACT_APP_DATA_PATH || "api"}`;
  const response = await fetch(url, {
    method: "GET",
    params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

function App() {
  const text = MakeStateful("");
  const response = MakeStateful({});
  const submitForm = (event) => {
    event.preventDefault();
    retrieveData({ assignee: text.value }).then((result) => {
      if (result) response.value = result;
    });
    text.value = "";
  };
  const data = Object.entries(response.value).map(()=>null);
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
          {response.value !== "" ? <BubbleChart
          graph= {{
            zoom: 1.1,
            offsetX: -0.05,
            offsetY: -0.01,
          }}
          width={1000}
          height={800}
          padding={0} // optional value, number that set the padding between bubbles
          showLegend={false}
          valueFont={{
            family: 'Arial',
            size: 12,
            color: '#fff',
            weight: 'bold',
          }}
          labelFont={{
            family: 'Arial',
            size: 16,
            color: '#fff',
            weight: 'bold',
          }}

          /> : null}
        </form>
      </header>
    </div>
  );
}

export default App;
