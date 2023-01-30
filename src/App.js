import 'normalize.css'
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch('https://restcountries.com/v2/all?fields=name,region,area')
    .then(resp => resp.json())
    .then(data => setCountries(data))
    .catch(reason => console.log(reason))
  }, []);

  const ListItem = (props) => {
    const {name, region, area, independent} = props.data;
    return (
      <div className='list-item'>
        <h2>{name}</h2>
        <p><span className='bold'>Region: </span>{region}</p>
        <p><span className='bold'>Area: </span>{area} km<sup>2</sup></p>
        <p><span className='bold'>Independant: </span>{independent ? "Yes" : "No"}</p>
      </div>
    );
  };

  return (
    <div className="app">
      <div className='top-bar'>
        <h1>Restcountries API Front-End</h1>
      </div>
      {countries.length > 0 &&
        <div className='country-list'>
          {countries.map((country, i) => <ListItem key={i} data={country}></ListItem>)}
        </div>
      }
    </div>
  );
}

export default App;
