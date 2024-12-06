

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


function renderHTML(newHTML) {
    const tasksContainer = document.getElementById('tasks')
    tasksContainer.innerHTML += newHTML
}

function clearForm() {
    const tasksForm = document.getElementById('tasksForm')
    tasksForm.reset()

    const descriptionInput = document.getElementById('description')
    descriptionInput.focus()
}


function saveTaskToStorage(taskObject) {
    // get JSON from local storage
    const currentTasksInStorageJSON = localStorage.getItem('tasks')

    // convert JSON to JavaScript object
    const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON)

    // the object I got is an array, push another item to the array
    currentTasksInStorage.push(taskObject)

    // save it back to the local storage
    localStorage.setItem('tasks', JSON.stringify(currentTasksInStorage))
}

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

function initStorage() {
    const currentTasksInStorageJSON = localStorage.getItem('tasks')
    if(!currentTasksInStorageJSON) {
        localStorage.setItem('tasks', JSON.stringify([]))
    }
    
}

function getNumberOfTasksInLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')).length
}

// function addTask(event) {
//     event.preventDefault()
//     const data = collectData()
//     const newHTML = generateHTML(data)
//     renderHTML(newHTML)
//     saveTaskToStorage(data)
//     clearForm()
// }

function addTask(event) {
    event.preventDefault();
    const data = collectData();
    const newHTML = generateHTML(data, "");
    renderHTML(newHTML);

  
    const taskElement = document.querySelector(`.task[data-index="${data.index}"]`);
    
    
    setTimeout(() => {
        taskElement.classList.add('show');
    }, 10); 

    saveTaskToStorage(data);
    clearForm();
}

// function deleteTask(index) {
//     alert(`will delete item #${index} from local storage`)
//     const tasks = JSON.parse(localStorage.getItem('tasks'));
//     tasks.splice(index, 1);
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//     document.getElementById('tasks').innerHTML = '';
//     loadTasksFromLocalStorage();
// }

function deleteTask(index) {
    alert(`will delete item #${index} from local storage`);
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskElement = document.querySelector(`.task[data-index="${index}"]`);
    taskElement.remove();
}

function renderTasks() {
 
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = ''; 

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const newHTML = generateHTML(task); 
        tasksContainer.innerHTML += newHTML; 
    });

    
}


initStorage()
loadTasksFromLocalStorage()
