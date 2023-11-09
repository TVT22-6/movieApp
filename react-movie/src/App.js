import { useContext, useEffect, useState } from "react";
import { MovieList } from './functions'; // Import from functions.js
import './App.css'
import { Login } from "./components/Auth";
import axios from "axios";
import SearchIcon from './search.svg'
import MovieCard from './MovieCard';

// ReadMe - React1 video käy läpi tämän ja muiden tiedostojen sisällön

/*
function App() {

  return (
    <div>
      <h4>Otsikko</h4>
      <Login/>
    </div>
);
}*/

const API_URL = 'http://www.omdbapi.com?apikey=d4f64de4'

const movie1 = {
  "Title": "Spiderman",
  "Year": "2010",
  "imdbID": "tt1785572",
  "Type": "movie",
  "Poster": "N/A"
}

const App = () => {

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();

    setMovies(data.Search);
  }


  useEffect(() => {

    searchMovies('Spiderman')

  }, []);

  return (
    <div className="app">
      <h1>NWADB</h1>
      <div className="search">
        <input placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {movies?.length > 0
        ? (<div className="container">
          {movies.map((movie) => (
            <MovieCard movie={movie} />
          ))}
        </div>
        ) : (
          <div className="empty">
            <h2>No movies found</h2>
          </div>
        )};
    </div>
    );
}


function PersonList() {

  const items = persons.map((p, i) => <li key={i}>{p.fname}</li>);

  return (
    <ul>
      {items}
    </ul>
  )
}


function PostExample() {

  useEffect(() => {

    const user = {
      username: 'repe',
      pw: 'asdfafs'
    }

    axios.postForm('http://localhost:3001/user', user )
      .then(resp => console.log('onnistui'))
      .catch(error => console.log(error.message))

  }, []);


  return (
    <div>

    </div>
  );
}


function GetExample() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://random-data-api.com/api/v2/users?size=10')
      .then(resp => {
        const uusi = resp.data.map(u => ({ email: u.email, avatar: u.avatar }));
        setUsers(uusi);
      })
      .catch(error => console.log(error.message))
  }, []);


  return (
    <div>
      {
        users.map(u => <UserInfo email={u.email} avatar={u.avatar} />)
      }
    </div>
  );
}

function UserInfo({ email, avatar }) {
  return (
    <div>
      <h4>{email}</h4>
      <img src={avatar} height={80} />
    </div>
  );
}


function DataExample(){

  const [text, setText] = useState('');
  const [texts, setTexts] = useState([]);

  return(
    <div>
      <input value={text} onChange={e => setText(e.target.value)}/>
      <button onClick={()=> setTexts( [...texts, text] )} >Add text</button>
      <ul>
        {texts.map(t => <li>{t}</li>)}
      </ul>
    </div>
  )

}

export default App;