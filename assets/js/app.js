
// Function to collect data from the form
function collectData() {
    const description = document.getElementById('description').value
    const date = document.getElementById('date').value
    const time = document.getElementById('time').value
    const index = getNumberOfTasksInLocalStorage()
    return {
        index,
        description,
        date,
        time,
    }
}

// Function to generate HTML for a new task
function generateHTML(data , show) {
        const newHTML = `
        <div class="task ${show}" data-index="${data.index}">
            <div class="close-icon">
                 <i class="bi bi-x" onclick="deleteTask(${data.index})"></i>
            </div>
            <div class="taskContent"> ${data.description}</div>
            <div class="taskFooter">
            <span>${data.date}</span>
            <span>${data.time}</span>
        </div>
    </div>
    `;
    console.log(newHTML)
    return newHTML
}

// Function to display the HTML created on the page
function renderHTML(newHTML) {
    const tasksContainer = document.getElementById('tasks')
    tasksContainer.innerHTML += newHTML
}

// Function to clear the form after adding a task
function clearForm() {
    const tasksForm = document.getElementById('tasksForm')
    tasksForm.reset()
    const descriptionInput = document.getElementById('description')
    descriptionInput.focus()
}

// Function to save a task in localStorage
function saveTaskToStorage(taskObject) {
    const currentTasksInStorageJSON = localStorage.getItem('tasks')  // get JSON from local storage
    const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON)    // convert JSON to JavaScript object
    currentTasksInStorage.push(taskObject)    // the object I got is an array, push another item to the array
    localStorage.setItem('tasks', JSON.stringify(currentTasksInStorage))    // save it back to the local storage

}

// Function to implement tasks from localStorage
function loadTasksFromLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks')
    if(tasksJSON) {
        const tasks = JSON.parse(tasksJSON)
        for(const task of tasks) {
            const newHTML = generateHTML(task , "show")
            renderHTML(newHTML)
        }
    }
}

// Function to initialize localStorage if it is empty
function initStorage() {
    const currentTasksInStorageJSON = localStorage.getItem('tasks')
    if(!currentTasksInStorageJSON) {
        localStorage.setItem('tasks', JSON.stringify([]))
    }
}

// Function to get the tasks in localStorage
function getNumberOfTasksInLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')).length
}

// Function to add a task
function addTask(event) {
    event.preventDefault();
    const data = collectData();
    const newHTML = generateHTML(data, "");
    renderHTML(newHTML);

    const taskElement = document.querySelector(`.task[data-index="${data.index}"]`);
    setTimeout(() => {
        taskElement.classList.add('show');
    }, 10); 

    saveTaskToStorage(data); // Save the task to localStorage
    clearForm(); // Clear the form
}

// Function to delete a task
function deleteTask(index) {
    alert(`will delete item #${index} from local storage`);
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskElement = document.querySelector(`.task[data-index="${index}"]`);
    taskElement.remove();
}

// Function to display all tasks in localStorage
function renderTasks() {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = ''; 

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const newHTML = generateHTML(task); 
        tasksContainer.innerHTML += newHTML; 
    }); 
}

// Initialize localStorage and load tasks from the repository
initStorage()
loadTasksFromLocalStorage()
