import {lazy, Suspense} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import AppHeader from "../appHeader/AppHeader.jsx";
import Spinner from "../spinner/Spinner.jsx";

const Page404 = lazy(() => import('../pages/404/404.jsx'));
const MainPage = lazy(() => import('../pages/MainPage.jsx'));
const ComicsPage = lazy(() => import('../pages/ComicsPage.jsx'));
const SingleComicPage = lazy(() => import('../pages/singleComicPage/SingleComicPage.jsx'));

const App = () => {
  return (
      <Router>
        <div className="app">
          <AppHeader/>
          <main>
            <Suspense fallback={<Spinner/>}>
              <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/comics" element={<ComicsPage/>}/>
                <Route path="/comics/:comicId" element={<SingleComicPage/>}/>
                <Route path="*" element={<Page404/>}/>
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
  )
}

export default App;