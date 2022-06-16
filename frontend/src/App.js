import Header from "./components/Header";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './stores/store';
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import {Container} from "@mui/material";
import PrivateRoute from "./PrivateRoute";
import Create from "./pages/Create";
import Marketplace from "./pages/Marketplace";
import NFTToken from "./pages/NFTToken";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Container>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path='/profile' element={<PrivateRoute element={<Profile />}/>} />
            <Route path='/create' element={<PrivateRoute element={<Create />}/>} />
            <Route path='/marketplace' element={<PrivateRoute element={<Marketplace />}/>} />
            <Route path='/nft-token' element={<PrivateRoute element={<NFTToken />}/>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
