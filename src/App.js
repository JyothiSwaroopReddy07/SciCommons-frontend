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
import CreateCommunity from './Pages/CreateCommunity/CreateCommunity';
import Notifications from './Pages/Notifications/Notifications';
import Feed from './Pages/Feed/Feed';
import CommunityPage from './Pages/CommunityPage/CommunityPage';
import JoinRequest from './Pages/JoinRequest/JoinRequest';
import CommunityAdminPage from './Pages/CommunityAdminPage/CommunityAdminPage';
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
        <Route path='/communitysuccessfulcreated' element={<CommunityCreation/>}/>
        <Route path='/notifications' element={<Notifications/>}/>
        <Route path='/myfeed' element={<Feed/>}/>
        <Route path="/community/:communityName" element={<CommunityPage/>}/>
        <Route path="/join-community/:communityName" element={<JoinRequest/>}/>
        <Route path="/mycommunity" element={<CommunityAdminPage/>}/>
        <Route path = "*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
