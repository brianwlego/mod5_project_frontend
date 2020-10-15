import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux'
import {addFav, removeFav} from '../redux/actions'


function DeckShow (props){
  const [deck, setDeck] = useState({})
  const [cardNum, setCardNum] = useState(0)
  const [front, setFront] = useState(false)
  const [favDeck, setFavDeck] = useState(false)

  useEffect(()=>{
    const deckId = window.location.pathname.split('/')[3]
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3000/api/v1/decks/${deckId}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accepts": "application/json"
      }
    })
    .then(resp=>resp.json())
    .then(data => {
      if(data.fav_deck !== null){
        setFavDeck(data.fav_deck)
      }
      setDeck(data.deck)
    })
  }, [])

  const previous = () => {
    if (cardNum >= 1){
      setCardNum(cardNum - 1)
      setFront(false)
    }
  }
  const next = () => {
    if (cardNum <= deck.cards.length - 2){
      setCardNum(cardNum + 1)
      setFront(false)
    }
  }
  const favHandler = () => {
    const token = localStorage.getItem('token')
    if (!favDeck){
      const configObj = {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accepts": "application/json"
        }
      }
      fetch(`http://localhost:3000/api/v1/decks/${deck.id}/favorite`, configObj)
      .then(resp=>resp.json())
      .then(data => {
        setFavDeck(data.fav_deck)
        props.addFav(deck)
      })
    } else {
      const configObj = {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accepts": "application/json"
        }
      }
      fetch(`http://localhost:3000/api/v1/decks/${deck.id}/unfavorite`, configObj)
      .then(resp=>resp.json())
      .then(data => {
        if(data.success){
          setFavDeck(false)
          props.removeFav(deck)
        }
      })
    }
  }


  return (
    <>
    {deck.cards !== undefined ? 
      <div className="deck-wrapper">
        <h3>Category: {deck.category}</h3>
        <h4>Title: {deck.title}</h4>
        <div id="deck-show-content" onClick={() => setFront(!front)} >
          <p>{!front ? deck.cards[cardNum].front : deck.cards[cardNum].back}</p>
        </div>
        <p>{cardNum + 1} of {deck.cards.length}</p>
        <div id="buttons-wrapper" >
          <button onClick={previous}>previous</button>
          <button onClick={next}>next</button>
        </div>
        <button onClick={favHandler}>{!favDeck ? "Add This Deck To Your Favorites" : "Remove This Deck From Favorites"}</button>
      </div>
      :
      <div className="deck-wrapper">
        <h3>Loading...</h3>
      </div>
    }
    </>
  )
}

const mdp = (dispatch) => {
  return {
    addFav: (newFav) => dispatch(addFav(newFav)),
    removeFav: (fav) => dispatch(removeFav(fav))
  }
}

export default connect(null, mdp)(DeckShow)