import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCardById } from '../api/card';
import { credentials, updateCollection } from '../api/auth';

const ShowCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [card, setCard] = React.useState(null);
  const [currentUser, setUser] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const data = await getCardById(id);
        console.log('data is', data);
        setCard(data);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
    console.log('card is', card);
  }, [id]);

  const addCard = async () => {
    try {
      await updateCollection(currentUser.id, {
        collection: [...currentUser.collection, card.id]
      });
      navigate('/cards');
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    const token = sessionStorage.getItem('token');
    const getData = async () => {
      try {
        const data = await credentials(token);
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, [id]);

  return (
    <section className="section hero is-fullheight-with-navbar">
      <div className="container">
        {!card ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2 className="title has-text-centered">{card.name}</h2>
            <div className="columns">
              <div className="column is-half">
                <figure className="image">
                  <img
                    src={`https://res.cloudinary.com/dthhn8y5s/${card.image}`}
                    alt={card.name}
                  />
                </figure>
              </div>
              <div className="column is-half">
                <h3>Stats</h3>
                <p>Strength: {card.strength}</p>
                <p>Charisma: {card.charisma}</p>
                <p>Intelligence: {card.intelligence}</p>
                <p>Special: {card.special}</p>
                {currentUser?.collection.length < 10 && (
                  <Link to="#" onClick={addCard}>
                    <p>Add Card to Collection</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowCard;
