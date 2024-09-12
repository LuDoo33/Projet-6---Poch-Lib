document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Créer un conteneur pour le bouton et le contenu
    let container = document.getElementById('container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'container';
        body.appendChild(container);
    }

    // Créer le bouton Ajouter un livre
    const addButton = document.createElement('button');
    addButton.textContent = 'Ajouter un livre';
    addButton.className = 'button add-book-button';
    container.appendChild(addButton);

    // Créer la section de contenu
    let contentDiv = document.getElementById('content');
    if (!contentDiv) {
        contentDiv = document.createElement('div');
        contentDiv.id = 'content';
        contentDiv.innerHTML = '<h2>Ma poch\'liste</h2>';
        container.appendChild(contentDiv);
    }

    // Fonction pour afficher les livres enregistrés dans la poch'liste
    function displayBooks() {
        const books = JSON.parse(sessionStorage.getItem('books')) || [];
        contentDiv.innerHTML = '<h2>Ma poch\'liste</h2>';
        if (books.length > 0) {
            const list = document.createElement('ul');
            books.forEach(book => {
                const listItem = document.createElement('li');
                listItem.className = 'book-item';

                // Titre
                const title = document.createElement('h3');
                title.textContent = `Titre : ${book.title}`;
                listItem.appendChild(title);

                // Identifiant
                const id = document.createElement('p');
                id.textContent = `ID: ${book.id}`;
                listItem.appendChild(id);

                // Auteur
                const author = document.createElement('p');
                author.textContent = `Auteur: ${book.author}`;
                listItem.appendChild(author);

                // Image
                const img = document.createElement('img');
                img.src = book.image || 'images/unavailable.png';
                img.alt = 'Image du livre';
                img.className = 'book-image';
                listItem.appendChild(img);

                // Description
                const description = document.createElement('p');
                description.textContent = book.description || 'Information manquante';
                listItem.appendChild(description);

                // Icône de corbeille
                const deleteIcon = document.createElement('button');
                deleteIcon.innerHTML = '<i class="fas fa-trash"></i>';
                deleteIcon.className = 'button delete-icon';
                deleteIcon.addEventListener('click', () => {
                    const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
                    const updatedBooks = storedBooks.filter(b => b.id !== book.id);
                    sessionStorage.setItem('books', JSON.stringify(updatedBooks));
                    displayBooks(); // Recharger la liste après suppression
                });
                listItem.appendChild(deleteIcon);

                list.appendChild(listItem);
            });
            contentDiv.appendChild(list);
        } else {
            contentDiv.innerHTML += '<p>Aucun livre enregistré.</p>';
        }
    }

    // Fonction pour afficher les résultats de recherche
    function displaySearchResults(books) {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.remove(); // Supprimer les résultats de recherche précédents
        }

        const newResults = document.createElement('div');
        newResults.id = 'searchResults';
        newResults.innerHTML = '<h2>Résultats de recherche</h2>';
        if (books.length > 0) {
            const list = document.createElement('div'); // Utiliser un div pour flexbox
            list.className = 'search-results-grid';
            books.forEach(item => {
                const listItem = document.createElement('div');
                listItem.className = 'book-item';

                // Titre
                const title = document.createElement('h3');
                title.textContent = `Titre : ${item.volumeInfo.title || 'Titre manquant'}`;
                listItem.appendChild(title);

                // Identifiant
                const id = document.createElement('p');
                id.textContent = `ID: ${item.id}`;
                listItem.appendChild(id);

                // Auteur
                const author = document.createElement('p');
                author.textContent = `Auteur: ${item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Auteur inconnu'}`;
                listItem.appendChild(author);

                // Image
                const img = document.createElement('img');
                img.src = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'images/unavailable.png';
                img.alt = 'Image du livre';
                img.className = 'book-image';
                listItem.appendChild(img);

                // Description
                const description = document.createElement('p');
                description.textContent = item.volumeInfo.description ? item.volumeInfo.description.substring(0, 200) + '...' : 'Information manquante';
                listItem.appendChild(description);

                // Icône de bookmark
                const bookmarkIcon = document.createElement('button');
                bookmarkIcon.innerHTML = '<i class="fas fa-bookmark"></i>';
                bookmarkIcon.className = 'button bookmark-icon';
                bookmarkIcon.addEventListener('click', () => {
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
                listItem.appendChild(bookmarkIcon);

                list.appendChild(listItem);
            });
            newResults.appendChild(list);
        } else {
            newResults.innerHTML += '<p>Aucun livre n’a été trouvé.</p>';
        }
        container.appendChild(newResults);
    }

    // Afficher les livres au chargement de la page
    displayBooks();

    // Ajouter un livre au clic sur le bouton
    addButton.addEventListener('click', () => {
        // Créer le formulaire
        const form = document.createElement('form');
        form.id = 'bookForm';

        const titleField = document.createElement('input');
        titleField.type = 'text';
        titleField.name = 'title';
        titleField.placeholder = 'Titre du livre';
        titleField.required = true;

        const authorField = document.createElement('input');
        authorField.type = 'text';
        authorField.name = 'author';
        authorField.placeholder = 'Auteur';
        authorField.required = true;

        const searchButton = document.createElement('button');
        searchButton.type = 'button';
        searchButton.textContent = 'Rechercher';
        searchButton.className = 'button search-button';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Annuler';
        cancelButton.className = 'button cancel-button';

        form.appendChild(titleField);
        form.appendChild(authorField);
        form.appendChild(searchButton);
        form.appendChild(cancelButton);

        // Remplacer le bouton Ajouter un livre par le formulaire
        container.replaceChild(form, addButton);

        // Gérer la recherche de livres
        searchButton.addEventListener('click', () => {
            const title = titleField.value.trim();
            const author = authorField.value.trim();

            // Validation des champs
            if (!title && !author) {
                alert('Veuillez entrer un titre ou un auteur pour rechercher.');
                return;
            }

            const query = `${title} ${author}`.trim();
            if (query) {
                fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        displaySearchResults(data.items || []);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la recherche:', error);
                    });
            }
        });

        // Gérer le bouton annuler
        cancelButton.addEventListener('click', () => {
            container.replaceChild(addButton, form);
            const searchResults = document.getElementById('searchResults');
            if (searchResults) {
                searchResults.remove();
            }
        });
    });
});
