import { useEffect, useState } from "react";

import MarvelService from "../../services/MarvelService.js";

import Spinner from "../spinner/Spinner.jsx";
import ErrorMessage from "../errorMessage/ErrorMessage.jsx";

import './charList.scss';

const CharList = () => {
	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	
	const marvelService = new MarvelService();

	useEffect(() => {
		onRequest()
	}, []);

	
	const onRequest = (offset) => {
		onCharListLoading();
		marvelService.getAllCharacters(offset)
			.then(onCharListLoaded)
			.catch(onError)
	}
	
	onCharListLoading = () => {
		this.setState({
			newItemLoading: true
		})
	}
	
	onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}
		
		this.setState(({ offset, charList }) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}))
	}
	
	onError = () => {
		this.setState({
			error: true,
			loading: false
		})
	}
	
	itemRefs = [];
	
	setRef = (ref) => {
		this.itemRefs.push(ref);
	}
	
	focusOnItem = (id) => {
		this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
		this.itemRefs[id].classList.add('char__item_selected');
		this.itemRefs[id].focus();
	}
	
	renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = {'objectFit' : 'cover'};
			if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				imgStyle = {'objectFit' : 'unset'}
			}
			
			return (
				<li
					className='char__item'
					tabIndex={0}
					ref={this.setRef}
					key={item.id}
					onClick={() => {
						this.props.onCharSelected(item.id)
						this.focusOnItem(i);
					}}
					onKeyPress={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							this.props.onCharSelected(item.id);
							this.focusOnItem(i);
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
	
	render() {

		const { charList, loading, error, offset, newItemLoading, charEnded } = this.state;

		const items = this.renderItems(charList);

		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					className="button button__main button__long"
					disabled={newItemLoading}
					style={{'display': charEnded ? 'none' : 'block'}}
					onClick={() => this.onRequest(offset)}
				>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

export default CharList;