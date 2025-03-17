import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');

  // Laad todos van de server
  useEffect(() => {
    fetch('/todos')
      .then(response => response.json())
      .then(data => {
        setTodos(data);
      })
      .catch(error => console.error('Fout bij het laden:', error));
  }, []);

  // Sla todos op in de server
  const saveTodosToFile = (updatedTodos) => {
    fetch('/save-todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodos),
    }).catch(error => console.error('Fout bij opslaan:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoText.trim() === '') return;

    setTodos(prevTodos => {
      const existingTodo = prevTodos.find(todo => todo.text === todoText);
      let updatedTodos;

      if (existingTodo) {
        updatedTodos = prevTodos.map(todo =>
          todo.text === todoText ? { ...todo, count: todo.count + 1 } : todo
        );
      } else {
        updatedTodos = [...prevTodos, { text: todoText, count: 1, completed: false }];
      }

      saveTodosToFile(updatedTodos);
      return updatedTodos;
    });

    setTodoText('');
  };

  const toggleComplete = (index) => {
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos];
      updatedTodos[index].completed = !updatedTodos[index].completed;
      saveTodosToFile(updatedTodos);
      return updatedTodos;
    });
  };

  return (
    <div className="todo-app">
      <h1>Mijn To-Do Lijst</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Nieuwe taak..."
        />
        <button type="submit">Toevoegen</button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(index)}
            />
            {todo.text} {todo.count > 1 ? `${todo.count}x` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
