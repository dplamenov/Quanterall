import Header from "./components/Header";
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './stores/store';

function App() {
  return (
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
}

export default App;
