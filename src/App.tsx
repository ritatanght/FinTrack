import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/";
import Dashboard from "./components/Dashboard";
import Create from "./components/Create";
import Search from "./components/View";
import SingleEntry from "./components/SingleEntry";
import Login from "./components/Login";
import AuthRequired from "./components/AuthRequired";
import NotFound from "./components/NotFound";
import { Entry } from "./types";
import { auth } from "./firebase/config";
import { getAll } from "./firebase/api";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    refetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  const refetchList = () => {
    if (currentUser) {
      getAll(currentUser.uid).then((data) => setEntries(data));
    }
  };
  const removeFromList = (id: string) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };
  const categoryList = [...new Set(entries.map((entry) => entry.category))];

  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthRequired user={currentUser} />}>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={<Dashboard entries={entries} user={currentUser} />}
            />
            <Route
              path="add"
              element={
                <Create categoryList={categoryList} refetchList={refetchList} />
              }
            />
            <Route path="entries" element={<Search />} />
            <Route
              path="entries/:id"
              element={<SingleEntry removeFromList={removeFromList} />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
