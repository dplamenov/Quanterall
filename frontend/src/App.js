import Header from "./components/Header";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './stores/store';
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import {Container} from "@mui/material";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Container>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path='/profile' element={<PrivateRoute element={<Profile />}/>} />
        </Routes>
        </Container>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
