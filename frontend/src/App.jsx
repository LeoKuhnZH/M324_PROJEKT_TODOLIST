import { useEffect, useState } from 'react'
import logo from './assets/react.svg'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [taskdescription, setTaskdescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    const trimmedDescription = taskdescription.trim();

    if (!trimmedDescription) {
      setError('Bitte gib eine Aufgabe ein.');
      return;
    }

    const alreadyExists = todos.some(todo =>
      todo.taskdescription?.toLowerCase() === trimmedDescription.toLowerCase()
    );

    if (alreadyExists) {
      setError('Diese Aufgabe ist bereits vorhanden.');
      return;
    }

    setError('');
    console.log('Sending task description to Spring-Server: ' + trimmedDescription);
    fetch('http://localhost:8080/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskdescription: trimmedDescription })
    })
      .then(() => {
        console.log('Receiving answer after sending to Spring-Server: ');
        setTaskdescription('');
        setTodos(prev => [...prev, { taskdescription: trimmedDescription }]);
      })
      .catch(() => setError('Fehler beim Speichern der Aufgabe.'));
  };

  const handleChange = event => {
    setTaskdescription(event.target.value);
  };

  useEffect(() => {
    fetch('http://localhost:8080/v1/')
      .then(response => {
        if (!response) {
          throw new Error('Failed to load tasks');
        }
        if (response.ok === false) {
          throw new Error('Failed to load tasks');
        }
        return response.json();
      })
      .then(data => {
        setTodos(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => setError('Fehler beim Laden der Aufgabenliste.'));
  }, []);

  const handleDelete = (event, taskdescription) => {
    event.preventDefault();
    console.log('Sending task description to delete on Spring-Server: ' + taskdescription);
    fetch('http://localhost:8080/v1/delete', {
      method: 'POST',
      body: JSON.stringify({ taskdescription: taskdescription }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        console.log('Receiving answer after deleting on Spring-Server: ');
        setTodos(prev => prev.filter(todo => todo.taskdescription !== taskdescription));
      })
      .catch(() => setError('Fehler beim Löschen der Aufgabe.'));
  };

  const renderTasks = todos => {
    return (
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={todo.taskdescription}>
            <span>{'Task ' + (index + 1) + ': ' + todo.taskdescription}</span>
            <button onClick={event => handleDelete(event, todo.taskdescription)}>✔</button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          ToDo Liste
        </h1>
        <form onSubmit={handleSubmit} className='todo-form'>
          <label htmlFor="taskdescription">Neues Todo anlegen:</label>
          <input
            id="taskdescription"
            type="text"
            value={taskdescription}
            onChange={handleChange}
          />
          <button type="submit">Absenden</button>
        </form>
        {error && <p role="alert">{error}</p>}
        <div>
          {renderTasks(todos)}
        </div>
      </header>
    </div>
  );
}

export default App
