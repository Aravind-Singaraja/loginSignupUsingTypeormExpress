import "reflect-metadata";
import { DataSource } from "typeorm";
import express from "express";
import jwt from "jsonwebtoken"
import { User } from "./entity/userEntity";
const app = express();
app.use(express.json());
const port = 2000;

app.post("/create", async (req, res) => {
  const userRepo = appSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email: req.body.email } });
// console.log(existingUser)
  if(existingUser){
    res.send({
      status: 0,
      message: "email already exists"
    })
  }
  let user = new User();
  user.name = req.body.name;
  user.age = req.body.age
  user.location = req.body.location;
  user.email = req.body.email;
  user.password = req.body.password;

  if (!userRepo){
    res.status(400).send("error occured in adding data")
  }
  const saveData = userRepo.save(user)
  res.status(200).send({
    status: 1,
    message: "data added successfully"
  })
});
app.post('/login', async(req,res)=>{
  const user = appSource.getRepository(User);
  const emailCheck = await user.findOne({
    where: {
      email: req.body.email
    }
  })
  const passwordCheck = await user.findOne({
    where: {
      password: req.body.password
    }
  })
  if (!passwordCheck && !emailCheck) {
    return res.status(400).send({
      status: 0,
      message: "email and password are incorrect"
    })
  }
  else {
    return res.status(200).send({
      status: 1,
      message: "login Successful", 
    
    })
  }
})

const appSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "test",
  entities: ["src/entity/*{.ts,.js}"],
  synchronize: true,
  logging: true
});
appSource
  .initialize()
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log("error on connecting db");
  });

app.listen(port, () => {
  console.log(`connected to the port ${port}`);
});
