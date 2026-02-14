document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const icon = toggleButton.querySelector('span');

    // Check local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateIcon(true);
    }

    toggleButton.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');

        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon(isDark);
    });

    function updateIcon(isDark) {
        if (icon) {
            if (isDark) {
                icon.classList.remove('fa-moon-o');
                icon.classList.add('fa-sun-o'); // Show sun when dark
            } else {
                icon.classList.remove('fa-sun-o');
                icon.classList.add('fa-moon-o'); // Show moon when light
            }
        }
    }
});
