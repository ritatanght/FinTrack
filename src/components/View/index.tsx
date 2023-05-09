import { momentParseDate } from "../../utils";
import { auth } from "../../firebase/config";
import { entriesQuery, getPaginatedEntries } from "../../firebase/api";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { Entry } from "../../types";
import { BsDashLg } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import moment from "moment";
import EntriesList from "./EntriesList";
import PulseLoader from "react-spinners/PulseLoader";

const View = () => {
  const [entriesList, setEntriesList] = useState<Entry[]>([]);
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot | null | undefined
  >(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category"));
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    setIsLoading(true);
    if ((startDate || endDate) && user) {
      entriesQuery(startDate, endDate, user.uid).then(
        (data) => data && setEntriesList(data)
      );
      setLastVisible(null);
    } else {
      fetchMore();
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, user]);

  const fetchMore = () => {
    if (lastVisible !== undefined && user) {
      getPaginatedEntries(entriesList, 10, lastVisible, user.uid).then(
        (res) => {
          if (res) {
            setEntriesList(res.data);
            setLastVisible(res.lastVisible);
          }
        }
      );
    }
  };

  const handleFilterChange = (key: string, value: string | null) => {
    setMessage("");
    // handle local state
    if (key === "category") {
      if (value) {
        setCategory(value);
      } else {
        setCategory("");
      }
    } else if (key === "startDate") {
      if (value && value !== "") {
        if (endDate !== "" && value > endDate) {
          setMessage("Note: The start date is after the end day.");
        }
        setStartDate(moment(value).format("YYYY-MM-DD"));
      } else {
        setStartDate("");
      }
    } else if (key === "endDate") {
      if (value && value !== "") {
        if (value < startDate) {
          setMessage("Note: The end date is before the start date");
        }
        setEndDate(moment(value).format("YYYY-MM-DD"));
      } else {
        setEndDate("");
      }
    }
    // handle params
    setSearchParams((prevParams) => {
      if (value === null || value === "") {
        prevParams.delete(key);
      } else {
        prevParams.set(key, value);
      }
      return prevParams;
    });
  };

  //reset all the filter to be the same as you first directed to the page
  const resetFilter = () => {
    handleFilterChange("category", null);
    handleFilterChange("startDate", "");
    handleFilterChange("endDate", "");
  };

  // Elements
  const categoryElList = [
    ...new Set(entriesList.map((entry) => entry.category)),
  ].map((cat) => (
    <button
      key={cat}
      onClick={() => handleFilterChange("category", cat)}
      className={`category-filter ${category === cat ? "selected" : ""}`}
    >
      {cat}
    </button>
  ));

  const displayedEntries = category
    ? entriesList.filter((entry) => entry.category === category)
    : entriesList;

  const entriesElement = displayedEntries.map((entry) => {
    return (
      <li key={entry.id}>
        <Link
          to={`${entry.id}`}
          className="single-entry"
          state={{
            search: searchParams.toString(),
          }}
        >
          <div className="entry-info">
            {momentParseDate(entry.date)}{" "}
            <span className="entry__category">{entry.category}</span>
            <span
              className={`amount-type ${entry.expense ? "expense" : "income"}`}
            >
              {entry.expense ? "-" : "+"}${entry.amount}
            </span>
          </div>
          <button className="entry__view-btn">View</button>
        </Link>
      </li>
    );
  });
  return (
    <main className="view-page">
      <h2>View Entries</h2>
      {message && <div className="message">{message}</div>}
      <div className="search__date">
        <input
          type="date"
          name="startDate"
          className="date__input text-center"
          value={startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />
        <BsDashLg className="date__dash" />
        <input
          type="date"
          name="endDate"
          className="date__input text-center"
          value={endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
        />
        <button
          className="btn reset-btn"
          aria-label="Reset all filters"
          onClick={resetFilter}
        >
          <GrPowerReset />
        </button>
      </div>
      {isLoading && entriesList.length === 0 ? (
        <div className="loader">
          <PulseLoader color="#fff" size={10} aria-label="Loading Spinner" />
        </div>
      ) : (
        <EntriesList
          category={category}
          categoryElList={categoryElList}
          handleFilterChange={handleFilterChange}
          fetchMore={fetchMore}
          lastVisible={lastVisible}
          startDate={startDate}
          endDate={endDate}
          entriesElement={entriesElement}
        />
      )}
    </main>
  );
};
export default View;
