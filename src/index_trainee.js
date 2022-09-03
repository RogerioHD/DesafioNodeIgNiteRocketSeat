const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());


//simula o banco
 const users = [{
  id:"f4fc17ad-bb0d-418b-a61e-6b9980a68020",
	name:"Joaozinho",
	username:"jjZ",
  todos:
  [
    {
      "id": "cccc3f6a-ea1a-4676-b715-1ed6aa72bb1f",
      "title": "Lavar o carro",
      "deadline": "2022-09-03T00:00:00.000Z",
      "done": false,
      "created_at": "2022-09-03T15:09:50.055Z"
    },
    {
      "id": "637b6036-a775-46e6-b0a5-79df45a7328f",
      "title": "Limpar a casa",
      "deadline": "2022-09-03T00:00:00.000Z",
      "done": false,
      "created_at": "2022-09-03T15:10:03.947Z"
    }
  ]
}];

function checksExistsUserAccount(request, response, next) {
  //const {name, username}=request.body;
  const {username}=request.headers
  // Complete aqui
  const user=users.find(u=>u.username==username);
  if(!user){
    //return response.status(400).json(`Usuario ${name} já Existe na base!!` )
    return response.status(400).json({
      error: 'Usuário não exsite na base'
    } )
  }else{
    // response.status(201).json({name, username})
    request.user=user
    return next();
  }
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username}=request.body;
  const userAlreadyExists=users.find(u=>u.username==username);
  if(userAlreadyExists){
    return response.status(400).json({error:"Usuário já existe"})
  }
  const newUser={ 
    id: uuidv4(),
    name, 
    username, 
    todos: []
  }
  users.push(newUser)
  response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  //const {username}=request.headers  
  const {user}=request
  // Complete aqui
 
  //console.log(user)
  response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  //const {username}=request.headers;
  const user=request.user
  const {title,deadline}=request.body;
  const newTodo={
    id:uuidv4(),
    title, 
    deadline: new Date(deadline),
    done:false,
    created_at:new Date()
  }
  
  user.todos=[...user.todos, newTodo];
  //response.status(200).json({message:"Nova tarefa cadastrada co sucesso"})
  response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id}=request.params;
  const {title, deadline}=request.body;
  const {user}=request;
  const todo=user.todos.find(t=>t.id==id);

  if(!todo){
    return response.status(404).json({error:"Não há tarefa"})
  }
///////////////////////
const updatedTodo={
  title, 
  deadline
}  
  const newTodoList=user.todos.map(todo=>{
    if(todo.id==id){
      todo={...todo, ...updatedTodo}
    }
    return todo
  })
  //console.log(newTodoList)
  user.todos=[...newTodoList];
  //////////////////
  /* 
  todo.title=title;
  todo.deadline=deadline; 
  */
  //////////////
  //response.status(201).json({message:"Todo Updated Successfully!!"});
  const todoIndex=user.todos.findIndex(t=>t.id==id)
  //console.log(user.todos[todoIndex])
  response.status(201).json(user.todos[todoIndex])
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user}=request;
  const {id}=request.params;
  const todo = user.todos.find(t=>t.id==id);
  if(!todo){
    return response.status(404).json({error:"Não há tarefa"})
  }
  todo.done=true;
  return response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user}=request;
  const {id}=request.params;
  ///////////////////////
  const todo = user.todos.find(t=>t.id==id);
  if(!todo){
    return response.status(404).json({error:"Não há tarefa"})
  }
  const newTodoList=user.todos.filter(t=>t.id!=id);
  user.todos=[...newTodoList];
  /////////////
  /* const todoIndex=user.todos.findIndex(t=>t.id===id);
  if(todoIndex==-1){
    return response.status(404).json({error:"Não há tarefa"})
  }
  user.todos.splice(todoIndex,1); */
///////////////

  return response.status(204).json()
});

module.exports = app;