import React, { useState, useEffect } from 'react';
import Movie from './Movie';

const Group = () => {
    const [groups, setGroups] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        // Fetch groups from API
        fetch('/api/groups')
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        // Fetch movies from API
        fetch('/api/movies')
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.error(error));
    }, []);

    const getBestRatedMoviesByGroup = (groupId) => {
        // Filter movies by group
        const groupMovies = movies.filter(movie => movie.groupId === groupId);
        // Sort movies by rating in descending order
        const sortedMovies = groupMovies.sort((a, b) => b.rating - a.rating);
        // Return the top 5 movies
        return sortedMovies.slice(0, 5);
    };

    const handleGroupChange = (event) => {
        const groupId = parseInt(event.target.value);
        setSelectedGroup(groupId);
    };

    return (
        <div>
            <div>
                <label htmlFor="group-select">Select a group:</label>
                <select id="group-select" onChange={handleGroupChange}>
                    <option value="">All groups</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>
            </div>
            {groups.map(group => (
                (selectedGroup === null || selectedGroup === group.id) && (
                    <div key={group.id}>
                        <h2>{group.name}</h2>
                        <ul>
                            {getBestRatedMoviesByGroup(group.id).map(movie => (
                                <Movie key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </div>
    );
};

export default Group;
