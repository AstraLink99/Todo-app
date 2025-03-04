// express boilerplate code , with express.json{} middleware

const express = require("express");
const { createTodo } = require("./types");
const { todo } = require("./db");
const cors = require("cors");
const app = express()


app.use(express.json());
app.use(cors)

app.post("/todo",async function(req,res){
    const createpayload = req.body;
    const parsedpayload = createTodo.safeParse(createpayload); //safeparse is a zod function
        if(!parsedpayload.success) {
            res.status(411).json({
                msg: "You sent wrong inputs",
            })
            return;
        }
        //put it in mongo db

        //awaiting this is good, as sometimes when db is down and this function does'nt seem to work , showing them "todo created" message would be wrong
        await todo.create({
            title: createpayload.title,
            description: createpayload.description,
            completed: false
        })

        res.json({
            msg: "todo created"
        })
})

app.get("/todos",async function(req,res){
    const todos = await todo.find({});
    res.json({
        todos
    })
})

app.put("/completed",async function(req,res){
    const updatepayload = req.body;
    const parsedpayload = updatepayload.safeParse(updatepayload);
        if(!parsedpayload.success) {
            res.status(411).json({
                msg: "You sent wrong inputs",
            })
            return;
        }

        await todo.update({
            _id:  req.body.id
        }, {
            completed: true
        })
        res.json({
            msg: "Todo marked as completed"
        })
})

app.listen(3000);


 