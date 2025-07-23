import {useParams, Link} from "react-router-dom";
import {useEffect, useState} from "react";

import useMarvelService from "../../../services/MarvelService.js";

import Spinner from "../../spinner/Spinner.jsx";
import ErrorMessage from "../../errorMessage/ErrorMessage.jsx";

import "./singleComicPage.scss";

const SingleComicPage = () => {
  const {comicId} = useParams();
  const [comic, setComic] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const {loading, error, getComic, clearError} = useMarvelService();

  useEffect(() => {
    setNotFound(false);
    clearError();
    setComic(null);

    getComic(comicId)
        .then(data => setComic(data))
        .catch(() => setNotFound(true));
  }, [comicId]);

  if (notFound) {
    return (
        <div>
          <ErrorMessage/>
          <p className="error__message">Page doesn’t exist</p>
          <Link className="error__message-back" to="/comics">
            Back to comics
          </Link>
        </div>
    );
  }

  const errorMessage = (error || notFound) && (
      <ErrorMessage text={notFound ? "Comic not found" : undefined}/>
  );
  const spinner = loading && !comic && <Spinner/>;
  const content = (!loading && !error && !notFound && comic) && (
      <View comic={comic}/>
  );

  return (
      <>
        {errorMessage}
        {spinner}
        {content}
      </>
  )
}

const View = ({comic}) => {
  const {title, description, pageCount, thumbnail, language, price} = comic;

  return (
      <div className="single-comic">
        <meta name="description" content={`${title} comics book`} />
        <title>{title}</title>

        <img src={thumbnail} alt={title} className="single-comic__img"/>
        <div className="single-comic__info">
          <h2 className="single-comic__name">{title}</h2>
          <p className="single-comic__descr">{description}</p>
          <p className="single-comic__descr">{pageCount}</p>
          <p className="single-comic__descr">Language: {language}</p>
          <div className="single-comic__price">{price}</div>
        </div>
        <Link to="/comics" className="single-comic__back">Back to all</Link>
      </div>
  )
}

export default SingleComicPage;