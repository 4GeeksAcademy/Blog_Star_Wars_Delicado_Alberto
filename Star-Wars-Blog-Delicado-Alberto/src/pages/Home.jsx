import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";

const Home = () => {
    const [beings, setBeings] = useState([]);
    const [worlds, setWorlds] = useState([]);
    const [vessels, setVessels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        Promise.all([
            fetch("https://www.swapi.tech/api/people").then(res => res.json()),
            fetch("https://www.swapi.tech/api/planets").then(res => res.json()),
            fetch("https://www.swapi.tech/api/vehicles").then(res => res.json()),
        ])
        .then(([beingData, worldData, vesselData]) => {
            setBeings(beingData.results || []);
            setWorlds(worldData.results || []);
            setVessels(vesselData.results || []);
            setLoading(false);
        })
        .catch(error => console.error("Error fetching data:", error));
    }, []);

    // Obtener imagenes por categoria
    const getImage = (category, id) =>
        `https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${category}/${id}.jpg`;

    return (
        <div className="container text-center mt-5">
            <h1 className="star-wars-title">Galactic Archives</h1>

            {loading ? (
                <div className="loader-container">
                    <div className="planet-loader"></div>
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    {/* Beings */}
                    <h2 className="category-title">Galactic Beings</h2>
                    <div className="row">
                        {beings.map((being) => (
                            <div key={being.uid} className="col-md-3 mb-4">
                                <div className="card">
                                    <img src={getImage("characters", being.uid)} className="card-img-top" alt={being.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{being.name}</h5>
                                        <Link to={`/character/${being.uid}`} className="btn btn-dark">
                                            View Details
                                        </Link>
                                        <FavoriteButton item={{ ...being, type: "character" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Worlds */}
                    <h2 className="category-title">Galactic Worlds</h2>
                    <div className="row">
                        {worlds.map((world) => (
                            <div key={world.uid} className="col-md-3 mb-4">
                                <div className="card">
                                    <img src={getImage("planets", world.uid)} className="card-img-top" alt={world.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{world.name}</h5>
                                        <Link to={`/planet/${world.uid}`} className="btn btn-dark">
                                            View Details
                                        </Link>
                                        <FavoriteButton item={{ ...world, type: "planet" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vessels */}
                    <h2 className="category-title">Galactic Vessels</h2>
                    <div className="row">
                        {vessels.map((vessel) => (
                            <div key={vessel.uid} className="col-md-3 mb-4">
                                <div className="card">
                                    <img src={getImage("vehicles", vessel.uid)} className="card-img-top" alt={vessel.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{vessel.name}</h5>
                                        <Link to={`/vehicle/${vessel.uid}`} className="btn btn-dark">
                                            View Details
                                        </Link>
                                        <FavoriteButton item={{ ...vessel, type: "vehicle" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
