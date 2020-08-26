import React from 'react';
import './App.css';
import { TextField, Button } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  const [text, setText] = React.useState("");
  const submit = () => {
    setText("");
  }
  return (
    <BrowserRouter basename="/"><ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <form onSubmit={(event)=>{event.preventDefault(); submit();}}>
            <TextField label="Patent holder" value={text} onChange={(event)=>setText(event.target.value)} />
            <Button variant="contained" color="primary" onClick={submit} >Submit</Button>
          </form>
        </header>
      </div>
    </ThemeProvider></BrowserRouter>
  );
}

export default App;
