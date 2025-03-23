document.addEventListener('DOMContentLoaded', () => {
    // To-Do Task Manager functionality
    const addTaskButton = document.getElementById('add-task');
    const newTaskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskText => {
        const listItem = createTaskElement(taskText);
        taskList.appendChild(listItem);
    });

    if (addTaskButton && newTaskInput && taskList) {
        addTaskButton.addEventListener('click', () => {
            const taskText = newTaskInput.value.trim();
            if (taskText !== '') {
                const listItem = createTaskElement(taskText);
                taskList.appendChild(listItem);
                tasks.push(taskText);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                newTaskInput.value = '';
            }
        });

        taskList.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-task')) {
                const listItem = event.target.parentElement;
                const taskText = listItem.querySelector('.task-text').textContent;
                taskList.removeChild(listItem);
                const taskIndex = tasks.indexOf(taskText);
                if (taskIndex > -1) {
                    tasks.splice(taskIndex, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                }
            } else if (event.target.classList.contains('edit-task')) {
                const listItem = event.target.parentElement;
                const taskText = listItem.querySelector('.task-text');
                const newTaskText = prompt('Edit task:', taskText.textContent);
                if (newTaskText !== null) {
                    const taskIndex = tasks.indexOf(taskText.textContent);
                    taskText.textContent = newTaskText.trim();
                    if (taskIndex > -1) {
                        tasks[taskIndex] = newTaskText.trim();
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                    }
                }
            }
        });
    }

    function createTaskElement(taskText) {
        const listItem = document.createElement('li');
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.classList.add('task-text');
        listItem.appendChild(taskSpan);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-task');
        listItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-task');
        listItem.appendChild(deleteButton);

        return listItem;
    }

    // Theme switcher functionality
    const themeSwitcher = document.getElementById('theme-switcher');
    const currentTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.classList.add(currentTheme);

    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
        const newTheme = document.body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
        localStorage.setItem('theme', newTheme);
    });

    // Fetch GitHub repository statistics
    const username = 'HonNoMushii';
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            const repoStatsElement = document.getElementById('repo-stats');
            let repoStatsContent = '<ul>';
            repos.forEach(repo => {
                repoStatsContent += `
                    <li>
                        <strong>${repo.name}</strong>: ${repo.stargazers_count} stars, ${repo.forks_count} forks
                    </li>
                `;
            });
            repoStatsContent += '</ul>';
            repoStatsElement.innerHTML = repoStatsContent;
        })
        .catch(error => console.error('Error fetching GitHub repo data:', error));
});
