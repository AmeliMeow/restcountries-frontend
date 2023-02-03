import "normalize.css";
import "./App.css";
import { useEffect, useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCaretForward,
  IoCaretBack,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import ReactPaginate from "react-paginate";

let ltArea;
const itemsPerPage = 10;

function ItemList({ items }) {
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
    items.length > 0 && (
      <div className="country-list">
        {items.map((item, i) => (
          <ListItem key={i} data={item}></ListItem>
        ))}
      </div>
    )
  );
}

function App() {
  const [countries, setCountries] = useState([]);
  const [data_output, setOutput] = useState([]);
  const [sort_order, setSortOrder] = useState("asc");
  const [current_page, setCurrentPage] = useState(0);

  useEffect(() => {
    fetch("https://restcountries.com/v2/all?fields=name,region,area")
      .then((resp) => resp.json())
      .then((data) => {
        setCountries(data);
        setOutput(data);
        ltArea = data.find((el) => el.name === "Lithuania").area; // Get area of Lithuania
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
    setCurrentPage(0); // Reset page when filter is changed
    if ("less_than_lt_area" === filter) {
      setOutput(countries.filter((country) => country.area < ltArea));
    } else if ("oceania" === filter) {
      setOutput(countries.filter((country) => country.region === "Oceania"));
    } else if ("both" === filter) {
      setOutput(
        countries.filter(
          (country) => country.region === "Oceania" && country.area < ltArea
        )
      );
    } else {
      setOutput(countries);
    }
  };

  const handlePageChange = (event) => setCurrentPage(event.selected);

  const pageCount = Math.ceil(data_output.length / itemsPerPage);
  const currentPageItems = data_output.slice(
    current_page * itemsPerPage,
    current_page * itemsPerPage + itemsPerPage
  );

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
      <ItemList items={currentPageItems} />
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={3}
        className="pagination"
        pageLinkClassName="btn page"
        previousLinkClassName="btn"
        nextLinkClassName="btn"
        onPageChange={handlePageChange}
        previousLabel={<IoCaretBack />}
        nextLabel={<IoCaretForward />}
        breakLabel={<IoEllipsisHorizontal />}
        forcePage={current_page}
        renderOnZeroPageCount={null}
      />
    </div>
  );
}

export default App;
