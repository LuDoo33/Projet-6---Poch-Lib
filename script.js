    document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container') || createContainer();
    const addButton = createButton('Ajouter un livre', 'button add-book-button');
    container.appendChild(addButton);

    const contentDiv = document.getElementById('content') || createContentSection();
    displayBooks();

    addButton.addEventListener('click', () => showForm(container, addButton));

    async function fetchBooks(query) {
    try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    displaySearchResults(data.items || []);
    } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    alert('Une erreur est survenue lors de la recherche.');
    }
    }

    function showForm(container, addButton) {
    const form = createForm();
    container.replaceChild(form, addButton);

    form.querySelector('.search-button').addEventListener('click', () => {
    const title = form.title.value.trim();
    const author = form.author.value.trim();
    if (!title || !author) {
        alert('Veuillez remplir à la fois le titre et l\'auteur pour rechercher.');
        return;
      }         
    fetchBooks(`${title} ${author}`.trim());
    });

    form.querySelector('.cancel-button').addEventListener('click', () => {
    container.replaceChild(addButton, form);
    document.getElementById('searchResults')?.remove();
    });
    }

    function displayBooks() {
    const books = JSON.parse(sessionStorage.getItem('books')) || [];
    const contentDiv = document.getElementById('content') || createContentSection();
    contentDiv.innerHTML = '<h2>Ma poch\'liste</h2>';

    if (books.length > 0) {
    const list = document.createElement('ul');
    books.forEach(book => {
    const listItem = document.createElement('li');
    listItem.className = 'book-item';

    listItem.innerHTML = `
    <h3>Titre : ${book.title}</h3>
    <p>ID: ${book.id}</p>
    <p>Auteur: ${book.author}</p>
    <img src="${book.image || 'images/unavailable.png'}" alt="Image du livre" class="book-image">
    <p>${book.description || 'Information manquante'}</p>
    <button class="button delete-icon"><i class="fas fa-trash"></i></button>
    `;

    listItem.querySelector('.delete-icon').addEventListener('click', () => {
    const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
    const updatedBooks = storedBooks.filter(b => b.id !== book.id);
    sessionStorage.setItem('books', JSON.stringify(updatedBooks));
    displayBooks(); // Recharger la liste après suppression
    });

    list.appendChild(listItem);
    });
    contentDiv.appendChild(list);
    } else {
    contentDiv.innerHTML += '<p>Aucun livre enregistré.</p>';
    }
    }

    function displaySearchResults(books) {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) searchResults.remove();

    const newResults = document.createElement('div');
    newResults.id = 'searchResults';
    newResults.innerHTML = '<h2>Résultats de recherche</h2>';

    if (books.length > 0) {
    const list = document.createElement('div');
    list.className = 'search-results-grid';

    books.forEach(item => {
    const listItem = document.createElement('div');
    listItem.className = 'book-item';

    listItem.innerHTML = `
    <h3>Titre : ${item.volumeInfo.title || 'Titre manquant'}</h3>
    <p>ID: ${item.id}</p>
    <p>Auteur: ${item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Auteur inconnu'}</p>
    <img src="${item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'images/unavailable.png'}" alt="Image du livre" class="book-image">
    <p>${item.volumeInfo.description ? item.volumeInfo.description.substring(0, 200) + '...' : 'Information manquante'}</p>
    <button class="button bookmark-icon"><i class="fas fa-bookmark"></i></button>
    `;

    listItem.querySelector('.bookmark-icon').addEventListener('click', () => {
    const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
    if (storedBooks.some(b => b.id === item.id)) {
    alert('Vous ne pouvez ajouter deux fois le même livre');
    } else {
    storedBooks.push({
    id: item.id,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Auteur inconnu',
    image: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'images/unavailable.png',
    description: item.volumeInfo.description ? item.volumeInfo.description.substring(0, 200) + '...' : 'Information manquante'
    });
    sessionStorage.setItem('books', JSON.stringify(storedBooks));
    displayBooks(); // Recharger la poch'liste après ajout
    }
    });

    list.appendChild(listItem);
    });
    newResults.appendChild(list);
    } else {
    newResults.innerHTML += '<p>Aucun livre n’a été trouvé.</p>';
    }
    container.parentNode.insertBefore(newResults, contentDiv);
    }

    function createContainer() {
    const container = document.createElement('div');
    container.id = 'container';
    document.querySelector('.h2').insertAdjacentElement('afterend', container);
    return container;
    }

    function createContentSection() {
    const contentDiv = document.createElement('div');
    contentDiv.id = 'content';
    contentDiv.innerHTML = '<h2>Ma poch\'liste</h2>';
    container.appendChild(contentDiv);
    return contentDiv;
    }

    function createForm() {
    const form = document.createElement('form');
    form.id = 'bookForm';

    form.innerHTML = `
    <input type="text" name="title" placeholder="Titre du livre" required>
    <input type="text" name="author" placeholder="Auteur" required>
    <button type="button" class="button search-button">Rechercher</button>
    <button type="button" class="button cancel-button" style="background-color: #DF5A4B;">Annuler</button>
    `;

    return form;
    }

    function createButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    return button;
    }
    });
