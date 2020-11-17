import React from "react"

export const App = props => {
  ////////////////
  //STATE
  ////////////////

  //Blank form object to initialize form and reset it
  const blankForm = {
    title: "",
    body: "",
  }

  // The State we'll save our API Data in
  const [todos, setTodos] = React.useState([])

  //State for Our Create Todo Form, initialized with empty strings
  const [createForm, setCreateForm] = React.useState(blankForm)

  //State for Our Update Todo Form, initialized with empty strings
  const [updateForm, setUpdateForm] = React.useState(blankForm)

  ////////////////////////
  // FUNCTIONS
  ////////////////////////

  //Our function to grab the latest list of todos
  const getTodos = async () => {
    //We make a request to our backend server
    const response = await fetch("http://localhost:3000/todos")
    //Convert the response into a javascript object
    const data = await response.json()
    //assign the data to our state
    setTodos(data)
  }

  //Function that returns JSX to display todos
  const TodosLoaded = () => (
    <>
      {todos.map(todo => (
        <div>
          <h2>{todo.title}</h2>
          <h3>{todo.body}</h3>
          <button onClick={() => setUpdateForm(todo)}>Edit</button>
          <button onClick={() => handleDelete(todo)}>Delete</button>
        </div>
      ))}
    </>
  )

  // Variable with JSX to display if no todos exist
  const noTodos = <h1>No Todos</h1>

  //Function to update state when people type in create form
  const handleCreateChange = event => {
    //update the create form state determining the key and value based on the form fields name and value properties since it will be the event target.
    setCreateForm({ ...createForm, [event.target.name]: event.target.value })
  }

  const handleCreate = async event => {
    //prevent form from refreshing screen
    event.preventDefault()
    //make post request to our backend server
    const response = await fetch("http://localhost:3000/todos", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createForm),
    })
    //update the list of todos be refetching the list
    await getTodos()
    //reset form
    setCreateForm(blankForm)
  }

  //Function to update state when people type in update form
  const handleUpdateChange = event => {
    //update the update form state determining the key and value based on the form fields name and value properties since it will be the event target.
    setUpdateForm({ ...updateForm, [event.target.name]: event.target.value })
  }

  const handleUpdate = async event => {
    //prevent form from refreshing screen
    event.preventDefault()
    //make put request to our backend server
    const response = await fetch(
      "http://localhost:3000/todos/" + updateForm.id,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateForm),
      }
    )
    //update the list of todos be refetching the list
    await getTodos()
    //reset form
    setUpdateForm(blankForm)
  }

  const handleDelete = async todo => {
    //prevent form from refreshing screen
    event.preventDefault()
    //make delete request to our backend server
    const response = await fetch("http://localhost:3000/todos/" + todo.id, {
      method: "delete",
    })
    //update the list of todos be refetching the list
    await getTodos()
  }

  /////////////////////////
  // useEffects
  /////////////////////////
  //useEffect to initially grab todos when page loads
  React.useEffect(() => {
    getTodos()
  }, [])

  /////////////////////////
  //RETURN JSX
  /////////////////////////
  //In the JSX below we run the TodosLoaded function if there is at least one todo or render the contents of noTodos if there isn't any.
  return (
    <div>
      <h1>The Todo App</h1>
      <h1>Create a Todo</h1>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          name="title"
          value={createForm.title}
          onChange={handleCreateChange}
        />
        <input
          type="text"
          name="body"
          value={createForm.body}
          onChange={handleCreateChange}
        />

        <input type="submit" value="Create Todo" />
      </form>
      <h1>Update a Todo</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="title"
          value={updateForm.title}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          name="body"
          value={updateForm.body}
          onChange={handleUpdateChange}
        />

        <input type="submit" value="Update Todo" />
      </form>
      <h1>Todos</h1>
      {todos.length > 0 ? TodosLoaded() : noTodos}
    </div>
  )
}
