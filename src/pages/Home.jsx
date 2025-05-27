import React from 'react';
import { useSwapi } from '../hooks/useSwapi';
import { CharacterCard } from '../components/CharacterCard';
import { VehicleCard } from '../components/VehicleCard';
import { PlanetCard } from '../components/PlanetCard';

export const Home = () => {
	const { people, vehicles, planets, isLoading, error } = useSwapi();

	if (isLoading) {
		return (
			<div className="d-flex justify-content-center">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="alert alert-danger" role="alert">
				{error}
			</div>
		);
	}

	return (
		<div className="container py-4">
			<h2 className="mb-4">Characters</h2>
			<div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
				{people.map(character => (
					<div key={character.uid} className="col">
						<CharacterCard character={character} />
					</div>
				))}
			</div>

			<h2 className="mb-4">Vehicles</h2>
			<div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
				{vehicles.map(vehicle => (
					<div key={vehicle.uid} className="col">
						<VehicleCard vehicle={vehicle} />
					</div>
				))}
			</div>

			<h2 className="mb-4">Planets</h2>
			<div className="row row-cols-1 row-cols-md-3 g-4">
				{planets.map(planet => (
					<div key={planet.uid} className="col">
						<PlanetCard planet={planet} />
					</div>
				))}
			</div>
		</div>
	);
}; 