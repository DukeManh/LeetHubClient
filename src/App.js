import { Provider } from 'react-redux';
import React from 'react';
import Main from './components/Main';
import { configureStore } from './redux/configureStore';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import 'bootswatch/dist/materia/bootstrap.min.css';
import './App.css';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
