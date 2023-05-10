import { CgArrowLeft } from "react-icons/cg";
import { RiEditBoxLine, RiDeleteBinLine } from "react-icons/ri";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { momentParseDate } from "../../utils";
import { getEntry, deleteEntry } from "../../firebase/api";
import { useState, useEffect } from "react";
import { Entry } from "../../types";
import PulseLoader from "react-spinners/PulseLoader";
import Modal from "./Modal";

interface RemoveFunc {
  removeFromList: (id: string) => void;
}

const SingleEntry: React.FC<RemoveFunc> = ({ removeFromList }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [entry, setEntry] = useState<Entry | null | undefined>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (id) {
      getEntry(id).then((data) => setEntry(data));
    }
  }, [id]);

  const handleEdit = () =>
    navigate("/add", { state: { ...entry, date: entry?.date.toDate() } });

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    removeFromList(id);
    navigate("/");
  };

  const search = location.state?.search ? `?${location.state.search}` : "";

  if (!id || entry === undefined) {
    return (
      <>
        <Link to=".." relative="path" className="return btn">
          <CgArrowLeft /> Return
        </Link>
        <h2>Entry not Found</h2>
      </>
    );
  }

  if (!entry) {
    return (
      <div className="loader">
        <PulseLoader color="#fff" size={10} aria-label="Loading Spinner" />
      </div>
    );
  }

  return (
    <main className="entry-page">
      {showAlert && (
        <Modal
          setShowAlert={setShowAlert}
          handleDelete={() => handleDelete(entry.id)}
        />
      )}
      <Link to={`..${search}`} relative="path" className="return btn">
        <CgArrowLeft /> Return
      </Link>

      <div className="entry__content">
        <ul>
          {entry.expense ? (
            <li className="expense">Expense</li>
          ) : (
            <li className="income">Income</li>
          )}
          <li>
            <span className="entry__heading">Amount</span>
            <span>{entry.amount}</span>
          </li>
          <li>
            <span className="entry__heading">Category</span>
            <span>{entry.category}</span>
          </li>
          <li>
            <span className="entry__heading">Date</span>
            <span>{momentParseDate(entry.date, "long")}</span>
          </li>
          {entry.description && (
            <li>
              <span className="entry__heading">Description</span>
              <span>{entry.description}</span>
            </li>
          )}
        </ul>
        <div className="entry__btn-container">
          <button className="edit-btn" onClick={handleEdit}>
            <RiEditBoxLine />
            Edit
          </button>
          <button className="delete-btn" onClick={() => setShowAlert(true)}>
            <RiDeleteBinLine />
            Delete
          </button>
        </div>
      </div>
    </main>
  );
};
export default SingleEntry;
