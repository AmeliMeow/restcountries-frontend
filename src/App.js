import 'normalize.css'
import './App.css';
import { useEffect, useState } from 'react';
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

function App() {
  const [countries, setCountries] = useState([]);
  const [sort_order, setSortOrder] = useState('asc');

  useEffect(() => {
    fetch('https://restcountries.com/v2/all?fields=name,region,area')
    .then(resp => resp.json())
    .then(data => setCountries(data))
    .catch(reason => console.log(reason));
  }, []);

  const btn_sort_click = () => {
    const s_order = sort_order === 'desc' ? 'asc' : 'desc';
    setSortOrder(s_order);
    setCountries(prevCountries => 
      prevCountries.sort((a, b) => {
        if (s_order === 'asc') {
          return a.name.localeCompare(b.name)
        }
        return b.name.localeCompare(a.name)
      })
    );
  }

  const ListItem = (props) => {
    const {name, region, area} = props.data;
    return (
      <div className='list-item'>
        <h2>{name}</h2>
        <p><span className='bold'>Region: </span>{region}</p>
        <p><span className='bold'>Area: </span>{area} km<sup>2</sup></p>
      </div>
    );
  };

  return (
    <div className="app">
      <div className='top-bar'>
        <h1>Restcountries API Front-End</h1>
        <div className='row'>
          <button className='btn' onClick={btn_sort_click}>Sort by name {sort_order === 'desc' ? <IoChevronDownOutline /> : <IoChevronUpOutline />}</button>
        </div>
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
