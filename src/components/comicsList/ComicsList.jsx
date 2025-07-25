import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";

import useMarvelService from "../../services/MarvelService.js";

import Spinner from "../spinner/Spinner.jsx";
import ErrorMessage from "../errorMessage/ErrorMessage.jsx";

import './comicsList.scss';


const ComicsList = () => {

  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const {loading, error, getAllComics} = useMarvelService();

  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      onRequest(offset, true);
      didFetch.current = true;
    }
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
        .then(onComicsListLoaded)
  }

  const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList.length < 8) {
      ended = true;
    }
    setComicsList([...comicsList, ...newComicsList]);
    setNewItemLoading(false);
    setOffset(offset + 8);
    setComicsEnded(ended);
  }

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      return (
          <li className='comics__item' key={`${item.id}-${i}`}>
            <Link to={`/comics/${item.id}`}>
              <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
              <div className="comics__item-name">{item.title}</div>
              <div className="comics__item-price">{item.price}</div>
            </Link>
          </li>
      )
    });

    return (
        <ul className='comics__grid'>
          {items}
        </ul>
    )
  }

  const items = renderItems(comicsList);

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;


  return (
      <div className="comics__list">
        {errorMessage}
        {spinner}
        {items}

        <button
            disabled={newItemLoading}
            style={{'display': comicsEnded ? 'none' : 'block'}}
            className="button button__main button__long"
            onClick={() => onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
  )
}

export default ComicsList;