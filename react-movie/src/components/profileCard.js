import React from 'react';
import PosterImg from '../styles/review.png'

const ProfileCard = ({ review }) => {
  const { moviename, uservotescore, content, dateposted } = review;

  return (
    <div className="movie">
                  <div>
                    <p>{new Date(review.dateposted).toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                    <img src={PosterImg} alt={review.moviename} />
                </div>
                <div>
                    <span>{review.genre}</span>
                    <h3>{review.moviename}</h3>
                </div>
            </div>
  );
};

export default ProfileCard;
