import {useHttp} from "../hooks/http.hook.js";

const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();

  const _apiBase = 'https://marvel-server-zeta.vercel.app/';
  const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
  const _baseOffset = 20;

  const _getResults = (res) => {
    // если ответ повторяет оригинальный Marvel API
    // 1) если вернулся именно массив
    if (Array.isArray(res)) {
      return res;
    }

    // 2) если { results: [...] }
    if (Array.isArray(res.results)) {
      return res.results;
    }

    // 3) если вложенный формат { data: { results: [...] } }
    if (res.data && Array.isArray(res.data.results)) {
      return res.data.results;
    }

    // на всякий случай
    throw new Error('Unexpected API response shape');
  };

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    const list = _getResults(res)

    return list.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    const list = _getResults(res);
    return _transformCharacter(list[0]);
  };

  const getAllComics = async (offset = 0) => {
    const res = await request(
        `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
    );
    const list = _getResults(res);
    return list.map(_transformComics);
  };

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    const list = _getResults(res);
    return _transformComics(list[0]);
  };

  const _transformCharacter = (char) => {
    // оригинальный URL
    let thumbnail = `${char.thumbnail.path}.${char.thumbnail.extension}`;

    // если URL содержит внешний хост, который не доступен — берем локальный
    if (thumbnail.includes('wallpaperflare.com')
        || thumbnail.includes('i.annihil.us')
    ) {
      thumbnail = '/img/default-character.png';
    }

      return {
        id: char.id,
        name: char.name,
        description: char.description
            ? `${char.description.slice(0, 210)}...`
            : 'There is no description for this character',
        thumbnail,
        homepage: char.urls[0].url,
        wiki: char.urls[1].url,
        comics: char.comics.items
      };
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || 'There is no description',
      pageCount: comics.pageCount
          ? `${comics.pageCount} p.`
          : 'No information about the number of pages',
      thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
      language: comics.textObjects[0]?.language || "en-us",
      price: comics.prices[0].price
          ? `${comics.prices[0].price}$`
          : 'not available'

    };
  };

  return {
    loading,
    error,
    clearError,
    getAllCharacters,
    getCharacter,
    getAllComics,
    getComics
  };
}

export default useMarvelService;