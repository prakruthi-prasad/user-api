var secrets = require('../config/secrets');
const User = require('../models/user')
const Task = require('../models/task')

module.exports = function (router) {

    var userRoute = router.route('/users');
    var userRouteid = router.route('/users/:id')
    var taskRoute = router.route('/tasks');
    var taskRouteid = router.route('/tasks/:id');

    //get list of all users
    userRoute.get(async function (req, res) {
        try {
            var user;
            const user_query = req.query.where ? JSON.parse(req.query.where) : {}
            const sort = req.query.sort ? JSON.parse(req.query.sort) : {}
            const select = req.query.select ? JSON.parse(req.query.select) : {}
            const skip = req.query.skip ? parseInt(req.query.skip) : 0
            const limit = parseInt(req.query.limit) || ""
            const count = req.query.count ? req.query.count : false
            console.log(count, "count")
            if (count == "true") {
                user = await User.find(user_query)
                    .limit(limit)
                    .sort(sort)
                    .select(select)
                    .count(count)
                    .skip(skip);
            }
            else {
                user = await User.find(user_query)
                    .limit(limit)
                    .sort(sort)
                    .select(select)
                    .skip(skip);
            }
            res.json({ message: "OK", data: user })

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

    //create a new user
    userRoute.post(async function (req, res) {
        const user = new User({
            name: req.body.name,
            email: req.body.email
        })
        try {
            const existing_user = await User.find(({ "email": req.body.email }))
            if (existing_user.length == 0) {
                const new_user = await user.save();
                res.status(201).json({ message: "User created", data: new_user })
            }
            else {
                res.status(500).json({ message: "User already exists" })
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message })
        }
    })

    //find user by user id
    userRouteid.get(async function (req, res) {
        try {
            const user_id = req.params.id
            const user = await User.find(({ _id: user_id }));
            if (user.length == 0) {
                res.status(404).json({ message: "User not found" })
            }
            else {
                res.json({ message: "OK", data: user })
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    })

    //delete a user by user id
    userRouteid.delete(getUser, async function (req, res) {
        try {
            await res.user.remove()
            res.json({ message: "User deleted" })
        }
        catch (err) {
            res.status(500).json({ message: err.message })
        }
    })

    //replace entire user by supplied user
    userRouteid.put(getUser, async function (req, res) {
        if (req.body.name != null) {
            res.user.name = req.body.name
        }
        if (req.body.email != null) {
            res.user.email = req.body.email
        }
        try {
            const updated_user = await res.user.save()
            res.json({ message: "User updated", data: updated_user })
        }
        catch (err) {
            res.status(400).json({ message: err.message })
        }
    })

    //function to find user by id
    async function getUser(req, res, val) {
        let user;
        try {
            user = await User.findById(req.params.id);
            if (user == null) {
                res.status(404).json({ message: "User not found" })
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message })
        }
        res.user = user
        val()
    }

    //get list of all tasks
    taskRoute.get(async function (req, res) {
        try {
            var task;
            const task_query = req.query.where ? JSON.parse(req.query.where) : {}
            const sort = req.query.sort ? JSON.parse(req.query.sort) : {}
            const select = req.query.select ? JSON.parse(req.query.select) : {}
            const skip = req.query.skip ? parseInt(req.query.skip) : 0
            const limit = parseInt(req.query.limit) || ""
            const count = req.query.count ? req.query.count : false
            if (count == "true") {
                task = await Task.find(task_query)
                    .limit(limit)
                    .sort(sort)
                    .select(select)
                    .count(count)
                    .skip(skip);
            }
            else {
                task = await Task.find(task_query)
                    .limit(limit)
                    .sort(sort)
                    .select(select)
                    .skip(skip);
            }
            //const task = await Task.find();
            res.json({ message: "OK", data: task })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

    //create a new task
    taskRoute.post(async function (req, res) {
        const task = new Task({
            name: req.body.name,
            description: req.body.description,
            deadline: req.body.deadline,
            completed: req.body.completed
        })
        try {
            const new_task = await task.save();
            res.status(201).json({ message: "Task created", data: new_task })
        }
        catch (err) {
            res.status(500).json({ message: err.message })
        }
    })

    //find a task by task id
    taskRouteid.get(async function (req, res) {
        try {
            const task_id = req.params.id
            const task = await Task.find(({ _id: task_id }));
            if (task.length == 0) {
                res.status(404).json({ message: "Task not found" })
            }
            else {
                res.json({ message: "OK", data: task })
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    })

    //delete a task by task id
    taskRouteid.delete(getTask, async function (req, res) {
        try {
            await res.task.remove()
            res.json({ message: "Task deleted" })
        }
        catch (err) {
            res.status(500).json({ message: err.message })
        }
    })

    //replace entire task by supplied task
    taskRouteid.put(getTask, async function (req, res) {
        if (req.body.name != null) {
            res.task.name = req.body.name
        }
        if (req.body.description != null) {
            res.task.description = req.body.description
        }
        if (req.body.deadline != null) {
            res.task.deadline = req.body.deadline
        }
        if (req.body.deadline != null) {
            res.task.completed = req.body.completed
        }
        try {
            const updated_task = await res.task.save()
            res.json({ message: "Task updated", data: updated_task })
        }
        catch (err) {
            res.status(400).json({ message: err.message })
        }
    })

    //function to find task by id
    async function getTask(req, res, val) {
        let task;
        try {
            task = await Task.findById(req.params.id);
            if (task == null) {
                res.status(404).json({ message: "Task not found" })
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message })
        }
        res.task = task
        val()
    }

    return router;
}
