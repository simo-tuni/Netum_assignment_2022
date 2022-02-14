import React from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";

let DUMMY_DATA = [
  { name: "John", lastname: "Doe", age: 50 },
  { name: "Mary", lastname: "Av", age: 35 },
  { name: "Noel", lastname: "VB", age: 25 },
  { name: "Sam", lastname: "TL", age: 45 },
];

function App() {
  let [item, setItem] = React.useState([]);
  let [newname, setNewname] = React.useState("");
  let [newlastname, setNewlastname] = React.useState("");
  let [newage, setNewAge] = React.useState("");
  let [sortsetting, setSortsetting] = React.useState(true);
  let [lastsort, setLastsort] = React.useState("");
  let [editing, setEditing] = React.useState(false);
  let [editIndex, setEditindex] = React.useState(0);

  React.useEffect(() => {
    async function fetchData() {
      const result = await axios.get("/api/getPeople");
      setItem([...result.data]);
    }
    fetchData();
  }, []);

  const deleteItem = async (index: number) => {
    /*
    setItem(
      item.filter((person, num) => {
        return num !== index;
      })
    );
    */
    const resultFromPost = await axios.post(`/api/deletePeople`, {
      index: index,
    });
    console.log(resultFromPost.data);
    setItem(resultFromPost.data);
  };

  const addItem = async () => {
    //setItem([...item, { name: newname, lastname: newlastname, age: newage }]);
    const resultFromPost = await axios.post(`/api/addPeople`, {
      name: newname,
      lastname: newlastname,
      age: newage,
    });
    setItem(resultFromPost.data);
  };

  const changed = (event: {
    target: { name: string; value: React.SetStateAction<string> };
  }) => {
    if (event.target.name === "name") {
      setNewname(event.target.value);
    } else if (event.target.name === "lastname") {
      setNewlastname(event.target.value);
    } else setNewAge(event.target.value);
  };

  const sortItem = (param: string) => {
    if (param === lastsort) setSortsetting(!sortsetting);
    else setSortsetting(true);

    setLastsort(param);
    var sortedArray = item.sort((a, b) => {
      if (a[param] > b[param]) {
        return sortsetting ? 1 : -1;
      }
      if (a[param] < b[param]) {
        return sortsetting ? -1 : 1;
      }
      return 0;
    });
    setItem([...sortedArray]);
  };

  const editItem = (index: number) => {
    setEditindex(index);
    setEditing(!editing);
    console.log(index);
  };

  const saveChanges = async (index: number) => {
    const resultFromPost = await axios.post(`/api/updatePeople`, {
      index: index,
      name: newname,
      lastname: newlastname,
      age: newage,
    });
    setItem(resultFromPost.data);
    /*
    item.forEach((item, num) => {
      if (num === index) {
        item.name = newname;
        item.lastname = newlastname;
        item.age = newage;
      }
    });
    */
    setEditing(false);
  };

  const cancelChanges = () => {
    setEditing(false);
  };

  const clearField = () => {
    setNewname("");
    setNewlastname("");
    setNewAge("");
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>
            <Button onClick={() => sortItem("name")}>Name</Button>
          </th>
          <th>
            <Button onClick={() => sortItem("lastname")}>Lastname</Button>
          </th>
          <th>
            <Button onClick={() => sortItem("age")}>Age</Button>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {item.map((person, index) => {
          return (
            <tr key={index}>
              {editing && index === editIndex && (
                <React.Fragment>
                  <th>
                    <input
                      value={newname}
                      onChange={changed}
                      type="text"
                      name="name"
                    />
                  </th>
                  <th>
                    <input
                      value={newlastname}
                      onChange={changed}
                      type="text"
                      name="lastname"
                    />
                  </th>
                  <th>
                    <input
                      value={newage}
                      onChange={changed}
                      type="number"
                      name="age"
                    />
                  </th>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => saveChanges(index)}
                    >
                      Save
                    </Button>{" "}
                    <Button variant="danger" onClick={() => cancelChanges()}>
                      Cancel
                    </Button>
                  </td>
                </React.Fragment>
              )}
              {!editing && (
                <React.Fragment>
                  <td>{person.name}</td>
                  <td>{person.lastname}</td>
                  <td>{person.age}</td>
                  <td>
                    <Button variant="primary" onClick={() => editItem(index)}>
                      Edit
                    </Button>{" "}
                    <Button variant="danger" onClick={() => deleteItem(index)}>
                      Delete
                    </Button>
                  </td>
                </React.Fragment>
              )}
            </tr>
          );
        })}
        {!editing && (
          <tr>
            <th>
              <input
                value={newname}
                onChange={changed}
                type="text"
                name="name"
              />
            </th>
            <th>
              <input
                value={newlastname}
                onChange={changed}
                type="text"
                name="lastname"
              />
            </th>
            <th>
              <input
                value={newage}
                onChange={changed}
                type="number"
                name="age"
              />
            </th>
            <th>
              <Button variant="primary" onClick={addItem}>
                Add
              </Button>{" "}
              <Button variant="danger" onClick={clearField}>
                Clear
              </Button>
            </th>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default App;
