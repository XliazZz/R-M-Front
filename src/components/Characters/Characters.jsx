import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCharacters } from '../../redux/Actions/actions';
import Card from '../Card/Card';
import style from "./Characters.module.css"
import { useParams } from 'react-router-dom';
import ScrollTop from '../ScrollTop/ScrollTop';
import CardLoading from '../CardLoading/CardLoading';

const Characters = () => {
  const dispatch = useDispatch();
  const { pageNumber } = useParams(); 

  const characters = useSelector((state) => state.characters)
  const isLoading = useSelector((state) => state.isLoading)

  const [currentPage, setCurrentPage] = useState(pageNumber ? pageNumber - 1 : 0);
  const [selectedSpecie, setSelectedSpecie] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); 
  const [selectedGender, setSelectedGender] = useState(''); 

  let filteredCharacters = characters;
  if (selectedSpecie) {
    filteredCharacters = characters.filter(character => character.species.includes(selectedSpecie));
  }
  if (selectedStatus) {
    filteredCharacters = filteredCharacters.filter(character => character.status.includes(selectedStatus))
  }
  if (selectedGender) {
    filteredCharacters = filteredCharacters.filter(character => character.gender.includes(selectedGender))
  }

  useEffect(() => {
    dispatch(getAllCharacters());
  }, [dispatch]);

  const itemsPerPage = 20;
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredCharacters.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredCharacters.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  }

  // Filter Species
  const [species, setSpecies] = useState([]);
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fetch('https://r-m-back-production.up.railway.app/species');
        const data = await response.json();
        setSpecies(data);
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    };

    fetchSpecies();
  }, []);

  const handleSpeciesChange = (event) => {
    setSelectedSpecie(event.target.value);
    setCurrentPage(0);
  }

  // Filter Status
  const [status, setStatus] = useState([]);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://r-m-back-production.up.railway.app/status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    };

    fetchStatus();
  }, []);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(0);
  }

  // Filter Gender
  const [gender, setGender] = useState([]);
  useEffect(() => {
    const fetchGender = async () => {
      try {
        const response = await fetch('https://r-m-back-production.up.railway.app/gender');
        const data = await response.json();
        setGender(data);
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    };
    fetchGender();
  }, []);

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
    setCurrentPage(0);
  }

  return (
    <div className={style.elCapo}>

      <div className={style.divFilters}>
        
        <div className={style.divFilter}>
          <h2 className={style.h2Filter}>Species</h2>
          <select value={selectedSpecie} onChange={handleSpeciesChange}>
            <option value="">All</option>
              {species.map(Specie => (
              <option key={Specie} value={Specie}>{Specie}</option>
              ))}
          </select>
        </div>

        <div className={style.divFilter}>
          <h2 className={style.h2Filter}>Status</h2>
          <select value={selectedStatus} onChange={handleStatusChange}>
            <option value="">All</option>
              {status.map(Statu => (
              <option key={Statu} value={Statu}>{Statu}</option>
              ))}
          </select>
        </div>

        <div className={style.divFilter}>
          <h2 className={style.h2Filter}>Gender</h2>
          <select value={selectedGender} onChange={handleGenderChange}>
            <option value="">All</option>
              {gender.map(gende => (
              <option key={gende} value={gende}>{gende}</option>
              ))}
          </select>
        </div>
      </div>

      <div className={style.contenedorCharacters}>
        {currentItems?.map((character) => {
          if (isLoading) {
            return <CardLoading key={character.id} />;
          } else {
            return (
              <Card
                key={character.id}
                id={character.id}
                name={character.name}
                status={character.status}
                species={character.species}
                gender={character.gender}
                image={character.image}
                origin={character.origin.name}
                onClose={character.onClose}
              />
            );
          }
        })}
      </div>
                
      <div className={style.contenedorboton}>
        {currentPage !== 0 &&             
        <button
          className={style.botonPage}
          onClick={() => handlePageChange({ selected: currentPage - 1 })}
          disabled={currentPage === 0}
        >
        Back
        </button>
        }

        <h2 className={style.spanPage}> {currentPage + 1}/{pageCount} </h2>
                
        { currentPage !== pageCount-1 &&               
        <button
          className={style.botonPage}
          onClick={() => handlePageChange({ selected: currentPage + 1 })}
          disabled={currentPage === pageCount - 1}
        >
        Next
        </button>
        }
      </div>

      <div id="botonTop" className={style.botonTop}>
        <ScrollTop id="botonTop" />
      </div>

    </div>
  )
};


export default Characters;
