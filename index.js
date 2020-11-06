const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

/*In order to access the data easily, 
we need the help of the express json-parser, 
that is taken to use with command app.use(express.json()). */
app.use(express.json());
app.use(express.static("build"));

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.use(cors());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const requestTime = new Date();
  const people = persons.length;

  res.send(`
        <p>Phonebook has info for ${people} people</p>
        <p>${requestTime}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
  // console.log(persons);
});

const generateId = () => {
  const id = Math.floor(Math.random() * 20000);
  return id;
};
app.post("/api/persons", (req, res) => {
  const body = req.body;
  const sameName = persons.find((person) => person.name === body.name);
  //console.log(sameName);
  if (!body.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  } else if (sameName && sameName.name === body.name) {
    // 409 conflict
    return res.status(409).json({
      error: "this contact already exist is missing",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  //console.log(person);

  persons = persons.concat(person);
  res.json(persons);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
