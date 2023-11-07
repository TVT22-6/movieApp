//Testing purposes

function MovieList() {
    const movies = [
      'The Shawshank Redemption',
      'The Godfather',
      'Pulp Fiction',
      'The Dark Knight',
      'Muumit Rivieralla',
    ];

    return (
      <div>
        <h2>List of Movies:</h2>
        <ul>
          {}
          {movies.map((movie, index) => (
             <li key={index}>{movie}</li>
          ))}
        </ul>
      </div>
    );
  }

 


  //Here you add the function you want to send to the App.js file
  export { MovieList };