let mongoose = require('mongoose')

var TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    deadline: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    assignedUser: {
        type: String,
        required: false,
        default: ""
    },
    assignedUserName: {
        type: String,
        required: false,
        default: "unassigned"
    },
    dateCreated: {
        type: Date,
        required: false,
        default: Date.now
    }
})

module.exports = mongoose.model('Task', TaskSchema)