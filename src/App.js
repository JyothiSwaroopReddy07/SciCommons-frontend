import './App.css';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import AllArticlesPage from './Pages/AllArticlesPage/AllArticlesPage';
import Communities from './Pages/Communities/Communities';
import SubmitArticle from './Pages/SubmitArticle/SubmitArticle';
import SuccessfulSubmission from './Components/SuccessfulSubmission';
import SuccessfulRegistration from './Components/SuccessfulRegistration';
import CommunityCreation from './Components/CommunityCreation';
import CreateCommunity from './Pages/CreateCommunity/CreateCommunity'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/articles' element={<AllArticlesPage />} />
        <Route path='/communities' element={<Communities/>}/>
        <Route path='/submitarticle' element={<SubmitArticle/>}/>
        <Route path='/articlesuccessfulsubmission' element={<SuccessfulSubmission/>}/>
        <Route path='/registersuccessful' element={<SuccessfulRegistration/>}/>
        <Route path='/createcommunity' element={<CreateCommunity/>}/>
        <Route path='/communitysuccessfulcreated' element={<CommunityCreation/>}/>'
        <Route path = "*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
