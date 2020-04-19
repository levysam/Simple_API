const express = require('express');

const server = express();

server.use(express.json());

const projects = [{id:"0", title: "tarefa-de-casa", tasks:["pagina 5", "pagina 6"]}, {id:"1", title: "tarefa-em-sala", tasks:["pagina 10", "pagina 11"]}];
const counter = [];

function checkProjectInArray (req, res, next) {
  const project = projects[req.params.index];

  if (!project){
    return res.status(400).json({error: 'Project doesn`t exists'});
  }
  req.project = project;
  return next();
}

function checkIfHasTitle(req, res, next){
  const {title} = req.body;

  if(!title){
    return res.status(400).json({error: "Title is nedded to create Project"});
  }
  return next();
}
function reqCount(req, res, next) {
  index= counter.length;
  counter.push(`${index}`);
  console.log(`${index+1} requisições feitas`)
  return next();
}

server.get('/projects',reqCount, (req, res) => {
  return res.json(projects);
});

server.get('/projects/:index',reqCount, checkProjectInArray, (req, res) => {
  return res.json(req.project);
});

server.post('/projects',checkIfHasTitle,reqCount, (req, res) => {
  const id = projects.length;
  const {title} = req.body;

  projects.push({id:`${id}`, title: `${title}`, tasks:[]});
  return res.json(projects);
});

server.post('/projects/:index/tasks',checkProjectInArray,checkIfHasTitle ,reqCount, (req, res) => {
  const {title} = req.body;
  const {index} = req.params;

  projects[index].tasks.push(title);
  return res.json(projects);
});

server.delete('/projects/:index',checkProjectInArray ,reqCount, (req, res) => {
  const {index} = req.params;
  projects.splice(index, 1);
  return res.send();
})

server.listen(3000);