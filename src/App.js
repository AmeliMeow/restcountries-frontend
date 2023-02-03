import "normalize.css";
import "./App.css";
import { useEffect, useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

let lt_area;

function App() {
  const [countries, setCountries] = useState([]);
  const [data_output, setOutput] = useState([]);
  const [sort_order, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch("https://restcountries.com/v2/all?fields=name,region,area")
      .then((resp) => resp.json())
      .then((data) => {
        setCountries(data);
        setOutput(data);
        lt_area = data.find((el) => el.name === "Lithuania").area; // Get area of Lithuania
      })
      .catch((reason) => console.log(reason));
  }, []);

  const sortData = () => {
    const s_order = sort_order === "desc" ? "asc" : "desc";
    setSortOrder(s_order);
    setOutput((prevOutput) =>
      prevOutput.sort((a, b) => {
        if (s_order === "asc") {
          return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
      })
    );
  };

  const filterData = (filter) => {
    if ("less_than_lt_area" === filter) {
      setOutput(countries.filter((country) => country.area < lt_area));
    } else if ("oceania" === filter) {
      setOutput(countries.filter((country) => country.region === "Oceania"));
    } else if ("both" === filter) {
      setOutput(
        countries.filter(
          (country) => country.region === "Oceania" && country.area < lt_area
        )
      );
    } else {
      setOutput(countries);
    }
  };

  const ListItem = (props) => {
    const { name, region, area } = props.data;
    return (
      <div className="list-item">
        <h2>{name}</h2>
        <p>
          <span className="bold">Region: </span>
          {region}
        </p>
        <p>
          <span className="bold">Area: </span>
          {area} km<sup>2</sup>
        </p>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="top-bar">
        <h1>Restcountries API Front-End</h1>
        <div className="row">
          <button className="btn" onClick={sortData}>
            Sort by name{" "}
            {sort_order === "desc" ? (
              <IoChevronDownOutline />
            ) : (
              <IoChevronUpOutline />
            )}
          </button>
          <div className="select">
            <select onChange={(event) => filterData(event.target.value)}>
              <option>Filter by...</option>
              <option value="less_than_lt_area">
                Countries smaller than Lithuania by area
              </option>
              <option value="oceania">Countries in Oceania region</option>
              <option value="both">
                Countries smaller than Lithuania by area in Oceania
              </option>
            </select>
          </div>
          <p className="info bold">{data_output.length} countries shown</p>
        </div>
      </div>
      {countries.length > 0 && (
        <div className="country-list">
          {data_output.map((country, i) => (
            <ListItem key={i} data={country}></ListItem>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
