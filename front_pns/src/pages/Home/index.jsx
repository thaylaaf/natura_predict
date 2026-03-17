import React from 'react';
import SearchContainer from '../../containers/SearchContainer';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-center m-12 text-4xl font-light">
        <span className="font-normal tracking-tight text-teal-700">NaturaPREDICT:</span>
        <span className="text-gray-600"> onde ciência e biodiversidade se conectam!</span>
      </h1>

      <p className="text-center font-light pb-4 text-gray-600">
        Uma plataforma para apresentar de maneira interativa e acessível os compostos químicos da natureza,<br />
        destacando suas propriedades.
      </p>

      {/* A busca entra aqui, logo abaixo do texto */}
      <SearchContainer />
    </div>
  );
}

export default Home;