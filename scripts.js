document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display tasks from a .md file
    fetch('tasks.md')
        .then(response => response.text())
        .then(data => {
            const taskList = document.getElementById('task-list');
            const tasks = data.split('\n').filter(task => task.trim() !== '');
            const ul = document.createElement('ul');
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.replace('- ', '');
                ul.appendChild(li);
            });
            taskList.appendChild(ul);
        });
});
