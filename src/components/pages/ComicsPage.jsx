import ComicsList from "../comicsList/ComicsList.jsx";
import AppBanner from "../appBanner/AppBanner.jsx";

const ComicsPage = () => {
  return (
      <>
        <meta name="description" content="Page with list of our comics"/>
        <title>Comics page</title>

        <AppBanner/>
        <ComicsList/>
      </>
  )
}

export default ComicsPage;
