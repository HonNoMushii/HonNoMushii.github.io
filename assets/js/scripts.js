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

    // GitHub Repo Stats Widget functionality
    const fetchRepoStatsButton = document.getElementById('fetch-repo-stats');
    const repoNameInput = document.getElementById('repo-name');
    const repoStatsElement = document.querySelector('.github-widgets #repo-stats');

    if (fetchRepoStatsButton && repoNameInput && repoStatsElement) {
        fetchRepoStatsButton.addEventListener('click', () => {
            const repoName = repoNameInput.value.trim();
            if (repoName !== '') {
                fetch(`https://api.github.com/repos/${repoName}`)
                    .then(response => response.json())
                    .then(repo => {
                        repoStatsElement.innerHTML = `
                            <p><strong>Repository:</strong> ${repo.full_name}</p>
                            <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
                            <p><strong>Forks:</strong> ${repo.forks_count}</p>
                            <p><strong>Issues:</strong> ${repo.open_issues_count}</p>
                            <p><strong>Contributors:</strong> <a href="${repo.contributors_url}" target="_blank">View Contributors</a></p>
                            <p><strong>License:</strong> ${repo.license ? repo.license.name : 'No license'}</p>
                        `;
                    })
                    .catch(error => console.error('Error fetching repo data:', error));
            }
        });
    }

    // GitHub Profile Card functionality
    const fetchProfileCardButton = document.getElementById('fetch-profile-card');
    const githubUsernameInput = document.getElementById('github-username');
    const profileCardElement = document.querySelector('.github-widgets #profile-card');

    if (fetchProfileCardButton && githubUsernameInput && profileCardElement) {
        fetchProfileCardButton.addEventListener('click', () => {
            const username = githubUsernameInput.value.trim();
            if (username !== '') {
                fetch(`https://api.github.com/users/${username}`)
                    .then(response => response.json())
                    .then(user => {
                        profileCardElement.innerHTML = `
                            <img src="${user.avatar_url}" alt="${user.login}'s avatar" style="width: 100px; height: 100px;">
                            <p><strong>Username:</strong> <a href="${user.html_url}" target="_blank">${user.login}</a></p>
                            <p><strong>Bio:</strong> ${user.bio || 'No bio available'}</p>
                            <p><strong>Followers:</strong> ${user.followers}</p>
                            <p><strong>Repositories:</strong> ${user.public_repos}</p>
                        `;
                    })
                    .catch(error => console.error('Error fetching user data:', error));
            }
        });
    }

    // GitHub Star Counter functionality
    const fetchStarCountButton = document.getElementById('fetch-star-count');
    const starUsernameInput = document.getElementById('star-username');
    const starCountElement = document.querySelector('.github-widgets #star-count');

    if (fetchStarCountButton && starUsernameInput && starCountElement) {
        fetchStarCountButton.addEventListener('click', () => {
            const username = starUsernameInput.value.trim();
            if (username !== '') {
                fetch(`https://api.github.com/users/${username}/repos`)
                    .then(response => response.json())
                    .then(repos => {
                        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
                        starCountElement.innerHTML = `<p><strong>Total Stars:</strong> ${totalStars}</p>`;
                    })
                    .catch(error => console.error('Error fetching star count:', error));
            }
        });
    }

    // GitHub Trending Repos Widget functionality
    const fetchTrendingReposButton = document.getElementById('fetch-trending-repos');
    const trendingReposElement = document.querySelector('.github-widgets #trending-repos');

    if (fetchTrendingReposButton && trendingReposElement) {
        fetchTrendingReposButton.addEventListener('click', () => {
            fetch('https://ghapi.huchen.dev/repositories')
                .then(response => response.json())
                .then(repos => {
                    let trendingReposContent = '<ul>';
                    repos.forEach(repo => {
                        trendingReposContent += `
                            <li>
                                <strong>${repo.name}</strong> by ${repo.author}: ${repo.stars} stars
                            </li>
                        `;
                    });
                    trendingReposContent += '</ul>';
                    trendingReposElement.innerHTML = trendingReposContent;
                })
                .catch(error => console.error('Error fetching trending repos:', error));
        });
    }
});
