import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { usePrevious } from "./components/Common";

// Note: We are defining these constants outside our App() function because if they were defined inside it,
// they would be recalculated every time the <App /> component re-renders, and we don't want that.
// This information will never change no matter what our application does
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

//console.log(`FILTER_MAP ${FILTER_MAP}`);

const FILTER_NAMES = Object.keys(FILTER_MAP);

//console.log(`FILTER_NAMES ${FILTER_NAMES}`);

function App(props) {
  // keep these logs for remembering
  //console.log("Call App");
  const [tasks, setTasks] = useState(props.tasks);
  //console.log(tasks);
  const [filter, setFilter] = useState("All");

  function addTask(name) {
    //console.log("Call addTask");
    const newTask = { id: `todo-${nanoid()}`, name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    //console.log("Call toggleTaskCompleted");
    const newTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (task.id == id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#mapped_array_contains_undefined
        // check Overriding properties if setting wrong order
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(newTasks);
  }

  function deleteTask(id) {
    //console.log("Call deleteTask");
    const remainingTasks = tasks.filter((task) => task.id !== id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    //console.log("Call editTask");
    //console.log(newName);
    // if this task has the same ID as the edited task
    const editedTaskList = tasks.map((item) => {
      if (item.id === id) {
        // Copy the task and update its name
        return { ...item, name: newName };
      }
      // Return the original task if it's not the edited task
      return item;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  //console.log(`filter list ${filterList}`);
  const taskNoun = taskList.length != 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${taskNoun} remaining`;

  const listHeadingRef = useRef(null);

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    console.log("useEffect" + prevTaskLength + tasks.length);
    if (tasks.length < prevTaskLength) {
      console.log("in useEffect");
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
