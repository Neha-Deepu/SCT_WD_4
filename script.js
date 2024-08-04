document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const tasksList = document.getElementById('tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value, dateInput.value, timeInput.value);
        taskInput.value = '';
        dateInput.value = '';
        timeInput.value = '';
    });

    tasksList.addEventListener('click', (e) => {
        const taskElement = e.target.closest('li');
        if (taskElement) {
            const id = taskElement.getAttribute('data-id');
            if (e.target.classList.contains('delete')) {
                deleteTask(id);
            } else if (e.target.classList.contains('edit')) {
                editTask(id);
            } else if (e.target.classList.contains('complete')) {
                completeTask(id);
            }
        }
    });

    function addTask(task, date, time) {
        const id = Date.now().toString();
        tasks.push({ id, task, date, time, completed: false });
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        const taskElement = document.querySelector(`li[data-id="${id}"]`);
        taskElement.style.animation = 'fadeOut 0.5s forwards';
        taskElement.addEventListener('animationend', () => {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        });
    }

    function editTask(id) {
        const taskToEdit = tasks.find(task => task.id === id);
        taskInput.value = taskToEdit.task;
        dateInput.value = taskToEdit.date;
        timeInput.value = taskToEdit.time;
        deleteTask(id);
    }

    function completeTask(id) {
        const taskToComplete = tasks.find(task => task.id === id);
        taskToComplete.completed = !taskToComplete.completed;
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        tasksList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.setAttribute('data-id', task.id);
            taskElement.classList.toggle('completed', task.completed);
            taskElement.innerHTML = `
                <div class="task-info">
                    <span>${task.task}</span>
                    <small>${task.date} ${task.time}</small>
                </div>
                <div class="task-actions">
                    <button class="complete">Complete</button>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            `;
            tasksList.appendChild(taskElement);
        });
    }

    renderTasks();
});
