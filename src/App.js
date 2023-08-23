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
import SinglePost from './Pages/SinglePost/SinglePost';
import CommunityAdminPage from './Pages/CommunityAdminPage/CommunityAdminPage';
import Profile from './Pages/Profile/Profile';
import Timeline from './Pages/Timeline/Timeline';
import BookMarks from './Pages/Bookmarks/Bookmarks';
import ArticlePage from './Pages/ArticlePage/ArticlePage';
import FavouritePage from './Pages/FavouritePage/FavouritePage';
import MyPostsPage from './Pages/MyPostsPage/MyPostsPage';
import MyArticlesPage from './Pages/MyArticlesPage/MyArticlesPage';
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
        <Route path='/explore' element={<Feed/>}/>
        <Route path='/mytimeline' element={<Timeline/>}/>
        <Route path='/bookmarks' element={<BookMarks/>}/>
        <Route path="/community/:communityName" element={<CommunityPage/>}/>
        <Route path="/join-community/:communityName" element={<JoinRequest/>}/>
        <Route path="/mycommunity" element={<CommunityAdminPage/>}/>
        <Route path="/post/:postId" element={<SinglePost/>}/>
        <Route path="/profile/:username" element={<Profile/>}/>
        <Route path="/article/:articleId" element={<ArticlePage/>}/>
        <Route path="/favourites" element={<FavouritePage/>} />
        <Route path="/myposts" element={<MyPostsPage/>}/>
        <Route path="/myarticles" element={<MyArticlesPage/>}/>
        <Route path = "*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
