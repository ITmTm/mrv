import {useEffect, useRef, useState} from "react";

import useMarvelService from "../../services/MarvelService.js";

import Spinner from "../spinner/Spinner.jsx";
import ErrorMessage from "../errorMessage/ErrorMessage.jsx";

import './charList.scss';

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charEnded, setCharEnded] = useState(false);


  const {loading, error, getAllCharacters} = useMarvelService();

  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      onRequest(offset, true);
      didFetch.current = true;
    }
  }, []);


  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
        .then(onCharListLoaded)
  }

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList(charList => [...charList, ...newCharList]);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => offset + 9);
    setCharEnded(charEnded => ended);
  }

  const itemRefs = useRef([]);


  const focusOnItem = (id) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = {'objectFit': 'cover'};
      if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'unset'}
      }

      return (
          <li
              className='char__item'
              tabIndex={0}
              ref={el => itemRefs.current[i] = el}
              key={`${item.id}-${i}`}
              onClick={() => {
                props.onCharSelected(item.id)
                focusOnItem(i);
              }}
              onKeyPress={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  props.onCharSelected(item.id);
                  focusOnItem(i);
                }
              }}
          >
            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
            <div className='char__name'>{item.name}</div>
          </li>
      )
    });

    return (
        <ul className='char__grid'>
          {items}
        </ul>
    )
  }


  const items = renderItems(charList);

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;

  return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {items}
        <button
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
  )
}

export default CharList;