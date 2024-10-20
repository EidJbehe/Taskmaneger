class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.tasks = Array.isArray(this.tasks) ? this.tasks : [];
        this.nextId = this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].id + 1 : 1;
        this.deletedIds = [];
    }

    // add new task
    addTask(description) {
        let taskId;
        if (this.deletedIds.length > 0) {
            taskId = this.deletedIds.shift();
        } else {
            taskId = this.nextId++;
        }

        const task = { id: taskId, description: description, completed: false };
        this.tasks.push(task);
        console.log(`Task "${description}" added successfully with ID ${task.id}.`);
        this.saveTasks();
    }

//    view all tasks
    displayTasks() {
        console.clear(); 
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
        } else {
            console.log("\nTask List:");
            this.tasks.forEach(task => {
                console.log(`${task.id}: ${task.description} - ${task.completed ? "Completed" : "Not Completed"}`);
            });
            console.log("\n");
        }
    }

    // switch task status
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            console.log(`Task ${task.id} is now ${task.completed ? "Completed" : "Not Completed"}.`);
            this.saveTasks();
        } else {
            console.log(`No task found with ID ${id}.`);
        }
    }

    // Remove task
    removeTask(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.deletedIds.push(id);
            console.log(`Task ${id} removed.`);
            this.saveTasks();
        } else {
            console.log(`No task found with ID ${id}.`);
        }
    }

    // Update the mission description
    updateTask(id, newDescription) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.description = newDescription;
            console.log(`Task ${task.id} updated to: "${newDescription}".`);
            this.saveTasks();
        } else {
            console.log(`No task found with ID ${id}.`);
        }
    }

    // to search for tasks
    searchTasks(query) {
        console.clear(); 
        const results = this.tasks.filter(task => task.description.toLowerCase().includes(query.toLowerCase()));
        if (results.length > 0) {
            console.log("\nSearch Results:");
            results.forEach(task => {
                console.log(`${task.id}: ${task.description} - ${task.completed ? "Completed" : "Not Completed"}`);
            });
            console.log("\n");
        } else {
            console.log(`No tasks found matching "${query}".`);
        }
    }

   // Save tasks to local storage
    saveTasks() {
        const data = {
            tasks: this.tasks,
            nextId: this.nextId,
            deletedIds: this.deletedIds
        };
        localStorage.setItem('tasks', JSON.stringify(data));
    }

    // load tasks from local storage
    loadTasks() {
        const data = localStorage.getItem('tasks');
        if (data) {
            const parsedData = JSON.parse(data);
            this.nextId = parsedData.nextId;
            this.deletedIds = parsedData.deletedIds || [];
            return parsedData.tasks;
        }
        return [];
    }
}

const taskManager = new TaskManager();

// Function to display list to user in console

function showMenu() {
    console.log("\nTask Manager Menu:");
    console.log("1. Add Task");
    console.log("2. View All Tasks");
    console.log("3. Toggle Task Completion");
    console.log("4. Remove Task");
    console.log("5. Update Task Description");
    console.log("6. Search Tasks");
    console.log("7. Exit");

    const choice = prompt("Choose an option (1-7):");

    if (choice) {
        handleChoice(choice);
    } else {
        console.log("No input received. Exiting...");
    }
}

function handleChoice(choice) {
    switch (choice) {
        case '1':
            const description = prompt("Enter task description:");
            if (description) {
                taskManager.addTask(description);
            } else {
                console.log("Task description cannot be empty.");
            }
            break;
        case '2':
            taskManager.displayTasks();
            break;
        case '3':
            const toggleId = parseInt(prompt("Enter task ID to toggle completion:"), 10);
            if (!isNaN(toggleId)) {
                taskManager.toggleTask(toggleId);
            } else {
                console.log("Invalid task ID.");
            }
            break;
        case '4':
            const removeId = parseInt(prompt("Enter task ID to remove:"), 10);
            if (!isNaN(removeId)) {
                taskManager.removeTask(removeId);
            } else {
                console.log("Invalid task ID.");
            }
            break;
        case '5':
            const updateId = parseInt(prompt("Enter task ID to update:"), 10);
            if (!isNaN(updateId)) {
                const newDescription = prompt("Enter new task description:");
                if (newDescription) {
                    taskManager.updateTask(updateId, newDescription);
                } else {
                    console.log("New description cannot be empty.");
                }
            } else {
                console.log("Invalid task ID.");
            }
            break;
        case '6':
            const query = prompt("Enter search query:");
            if (query) {
                taskManager.searchTasks(query);
            } else {
                console.log("Search query cannot be empty.");
            }
            break;
        case '7':
            console.log("Exiting...");
            return;
        default:
            console.log("Invalid choice, try again.");
    }

    setTimeout(showMenu, 1000);
}

showMenu();