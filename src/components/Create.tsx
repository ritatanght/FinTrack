import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/config";
import { updateEntry, addEntry } from "../firebase/api";
import { Timestamp } from "firebase/firestore";
import { BiLeftArrow } from "react-icons/bi";
import moment from "moment";

interface Props {
  categoryList: string[];
  refetchList: () => void;
}

const Create: React.FC<Props> = ({ categoryList, refetchList }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [entry, setEntry] = useState(location.state);
  const [expense, setExpense] = useState<boolean>(entry ? entry.expense : true);
  const [amount, setAmount] = useState(entry?.amount || 0);
  const [date, setDate] = useState(entry?.date || new Date());
  const [category, setCategory] = useState(entry?.category || "");
  const [description, setDescription] = useState(entry?.description || "");
  const [message, setMessage] = useState("");
  const user = auth.currentUser;

  const handleSubmit = (e: React.SyntheticEvent, cont: boolean = false) => {
    e.preventDefault();
    setMessage("");
    if (amount < 0 || Number.isNaN(amount)) {
      setMessage("Please input a valid amount.");
      return;
    } else if (isNaN(date)) {
      setMessage("Please input a valid date.");
      return;
    } else if (!category) {
      setMessage("Please pick a category for the entry.");
      return;
    } else {
      if (user) {
        let newEntry = {
          expense,
          amount: Number(amount),
          date: Timestamp.fromDate(date),
          category,
          description,
          userId: user.uid,
        };
        if (entry) {
          updateEntry(entry.id, { ...newEntry, id: entry.id });
          if (cont) {
            setEntry(null);
            return;
          }
          navigate(`/entries/${entry.id}`);
        } else {
          addEntry(newEntry);
          if (cont) {
            return;
          }
          navigate("/");
        }
        refetchList();
      } else {
        setMessage("Login required to add entry");
      }
    }
  };

  const saveAndNew = (e: React.SyntheticEvent) => {
    handleSubmit(e, true);
    refetchList();
    setExpense(true);
    setAmount(0);
    setDate(new Date());
    setCategory("");
    setDescription("");
  };

  return (
    <main className="create">
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <label className="toggle">
          <input
            className="toggle-input"
            type="checkbox"
            name="expense"
            checked={expense}
            onChange={() => setExpense(!expense)}
          />
          <div className="toggle-btn text-center">
            <span>Expense</span>
            <span>Income</span>
          </div>
        </label>
        <input
          type="number"
          name="amount"
          autoFocus
          className={`text-center ${expense ? "expense" : "income"}`}
          value={amount.toString()}
          onChange={(e) =>
            setAmount(Number(parseFloat(e.target.value).toFixed(2)))
          }
        />
        <input
          className="text-center"
          type="date"
          name="date"
          value={moment(date).format("YYYY-MM-DD")}
          onChange={(e) => setDate(new Date(`${e.target.value} EDT`))}
        />
        <div className="category-btn-container">
          {categoryList.length > 0 ? (
            categoryList.map((cat) => (
              <span key={cat}>
                <input
                  type="radio"
                  className="category-radio"
                  id={cat}
                  name="category"
                  value={cat}
                  onChange={(e) => setCategory(cat)}
                  checked={cat === category}
                />
                <label htmlFor={cat}>{cat}</label>
              </span>
            ))
          ) : (
            <p>Enter a category for your entry</p>
          )}
        </div>
        <div className="category__input-container">
          {categoryList.length > 0 && (
            <BiLeftArrow className="category__arrow" />
          )}
          <input
            name="category"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <textarea
          name="description"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="create__btn-container">
          <button className="btn">Save</button>{" "}
          <button onClick={saveAndNew} className="btn">
            Save & Add another
          </button>
        </div>
      </form>
    </main>
  );
};
export default Create;
