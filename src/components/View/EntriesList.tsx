import { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsArrowUpSquareFill } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import PulseLoader from "react-spinners/PulseLoader";

interface ListProps {
  category: string | null;
  categoryElList: JSX.Element[];
  handleFilterChange: (key: string, value: string | null) => void;
  fetchMore: () => void;
  lastVisible: QueryDocumentSnapshot | null | undefined;
  startDate: string;
  endDate: string;
  entriesElement: JSX.Element[];
}

const EntriesList: React.FC<ListProps> = ({
  category,
  categoryElList,
  handleFilterChange,
  fetchMore,
  lastVisible,
  startDate,
  endDate,
  entriesElement,
}) => {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const scrollButtonVisibility = () =>
      window.pageYOffset > 250 ? setShowButton(true) : setShowButton(false);
    window.addEventListener("scroll", scrollButtonVisibility);
    return () => window.removeEventListener("scroll", scrollButtonVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (entriesElement.length === 0) {
    return <p>No Entries Found</p>;
  }

  return (
    <>
      {categoryElList.length > 0 && (
        <div className="category-filter-container">
          {categoryElList}
          {category && (
            <button
              className="category-filter clear-filter"
              onClick={() => handleFilterChange("category", null)}
            >
              Clear Category
            </button>
          )}
        </div>
      )}

      <InfiniteScroll
        dataLength={10}
        next={fetchMore}
        hasMore={
          lastVisible === undefined || startDate || endDate ? false : true
        }
        loader={
          <div className="loader">
            <PulseLoader color="#fff" size={10} aria-label="Loading Spinner" />
          </div>
        }
        endMessage={<p className="text-center">- End of List -</p>}
      >
        <ul className="entries">{entriesElement}</ul>
      </InfiniteScroll>
      {showButton && (
        <BsArrowUpSquareFill onClick={scrollToTop} className="top-btn" />
      )}
    </>
  );
};

export default EntriesList;
