document.addEventListener('DOMContentLoaded', function() {

    let filters = document.querySelectorAll('input[type="radio"]');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelector('form').submit();
        });
    });
});