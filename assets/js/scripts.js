document.addEventListener('DOMContentLoaded', () => {
    // To-Do Task Manager functionality
    const addTaskButton = document.getElementById('add-task');
    const newTaskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const listItem = createTaskElement(task.text, task.completed);
        taskList.appendChild(listItem);
    });

    if (addTaskButton && newTaskInput && taskList) {
        addTaskButton.addEventListener('click', () => {
            const taskText = newTaskInput.value.trim();
            if (taskText !== '') {
                const listItem = createTaskElement(taskText, false);
                taskList.appendChild(listItem);
                tasks.push({ text: taskText, completed: false });
                localStorage.setItem('tasks', JSON.stringify(tasks));
                newTaskInput.value = ''; // Clear input field
            }
        });

        taskList.addEventListener('click', (event) => {
            const listItem = event.target.closest('li');
            const taskText = listItem.querySelector('.task-text');

            if (event.target.classList.contains('delete-task')) {
                listItem.remove();
                updateLocalStorage();
            } else if (event.target.classList.contains('edit-task')) {
                const newTaskText = prompt('Edit task:', taskText.textContent);
                if (newTaskText) {
                    taskText.textContent = newTaskText;
                    updateLocalStorage();
                }
            } else if (event.target.classList.contains('complete-task')) {
                listItem.classList.toggle('completed');
                updateLocalStorage();
            }
        });
    }

    function createTaskElement(taskText, completed) {
        const listItem = document.createElement('li');
        listItem.classList.toggle('completed', completed);

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.classList.add('task-text');
        listItem.appendChild(taskSpan);

        const completeButton = document.createElement('button');
        completeButton.textContent = '✓';
        completeButton.classList.add('complete-task');
        listItem.appendChild(completeButton);

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

    function updateLocalStorage() {
        const updatedTasks = Array.from(taskList.children).map(task => ({
            text: task.querySelector('.task-text').textContent,
            completed: task.classList.contains('completed'),
        }));
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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

    // GitHub Repository Stats
    const repoStatsElement = document.getElementById('repo-stats');
    const githubUsername = "HonNoMushii"; // Your GitHub username

    async function fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
            if (!response.ok) throw new Error("GitHub API request failed.");

            const repos = await response.json();
            let repoStatsContent = '<ul>';
            
            repos.forEach(repo => {
                repoStatsContent += `
                    <li>
                        <strong>${repo.name}</strong>: ⭐ ${repo.stargazers_count} stars, 🍴 ${repo.forks_count} forks
                    </li>
                `;
            });

            repoStatsContent += '</ul>';
            repoStatsElement.innerHTML = repoStatsContent;
        } catch (error) {
            repoStatsElement.innerHTML = `<p>Error loading GitHub data. Please refresh or try again later.</p>`;
            console.error("Error fetching GitHub repo data:", error);
        }
    }

    fetchGitHubStats(); // Fetch data on page load
});
