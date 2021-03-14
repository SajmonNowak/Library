const addBookButton = document.getElementById('addBookBtn');
const submitNewBookButton = document.getElementById('submitNewBookBtn');
const modal = document.getElementById('modal');
let bookToEdit = '';
let BookGrid = document.createElement('div');
document.body.appendChild(BookGrid);
let myLibrary = [];
let ErrorMessage = document.createElement('p');
let readPagesValue = '';
let totalPagesValue = '';

function Book(title, author, pages, read, status) {
    this.title = title
    this.author = author 
    this.pages = pages 
    this.read = read 
    this.status = status
}

function addBookToLibrary(){
    resetBookGrid();
    createBook();
    showBooks();
    closeModal();
}

function createBook(){
    let newBook = new Book ( document.getElementById('titleInput').value, document.getElementById('authorInput').value ,
        Number(document.getElementById('totalPagesInput').value), Number(document.getElementById('readPagesInput').value), "Not started");
    createStatus(newBook);
    myLibrary.push(newBook);
}

function showBooks(){
    console.log(myLibrary);
    for ( let element of myLibrary) {
        createBookDiv(element);
    }
    updateCounter();
    populateStorage();
}

function createBookDiv(book) {
    let BookDiv = document.createElement('div');
    let title = document.createElement('h2');
    let author = document.createElement('h2');
    let pagesRead = document.createElement('h3');
    let pagesTotal = document.createElement('h3');
    let topButtonDiv = document.createElement('div');
    let deleteButton = document.createElement('button');
    let editButton = document.createElement('button');
    let plusButton = document.createElement('button');
    let minusButton = document.createElement('button');
    let finishedButton = document.createElement('button');
    let breakSign = document.createElement('p');

    title.textContent = book.title;
    author.textContent = `by ${book.author}`;
    pagesRead.textContent = book.read;
    pagesTotal.textContent = book.pages;
    deleteButton.textContent = 'Delete';
    editButton.textContent = 'Edit';
    plusButton.textContent = '+';
    minusButton.textContent = '-';
    finishedButton.textContent = '✔';
    breakSign.textContent ='|';

    BookDiv.classList.add('bookDiv');
    title.classList.add(giveTitleClass(title), 'title');
    author.classList.add('bookAuthor');
    topButtonDiv.classList.add('topButtonDiv');
    editButton.classList.add('editButton', 'topBookButton');
    deleteButton.classList.add('deleteButton', 'topBookButton');
    minusButton.classList.add('minusButton', 'botBookButton');
    finishedButton.classList.add('finishedButton', 'botBookButton');
    plusButton.classList.add('plusButton', 'botBookButton');
    pagesRead.classList.add('pagesRead', 'pagesCount');
    pagesTotal.classList.add('pagesTotal', 'pagesCount');
    breakSign.classList.add('breakSign');

    topButtonDiv.appendChild(deleteButton);
    topButtonDiv.appendChild(editButton);
    BookDiv.appendChild(topButtonDiv);
    BookDiv.appendChild(title);
    BookDiv.appendChild(author);
    BookDiv.appendChild(pagesRead);
    BookDiv.appendChild(pagesTotal);
    BookDiv.appendChild(minusButton);
    BookDiv.appendChild(finishedButton);
    BookDiv.appendChild(plusButton);
    BookDiv.appendChild(breakSign);

    BookDiv.id = title.textContent + pagesTotal.textContent;

    deleteButton.addEventListener ('click', function(e){
        e.preventDefault();
        deleteBook(e);
    })
    editButton.addEventListener ('click', function(e){
        e.preventDefault();
        editBook(BookDiv, book);
    })
    plusButton.addEventListener ('click', function(e){
        e.preventDefault();
        addOrSubtractPage(e, book, BookDiv);
    })
    minusButton.addEventListener('click', function(e){
        e.preventDefault();
        addOrSubtractPage(e, book, BookDiv);
    })
    finishedButton.addEventListener('click', function(e){
        e.preventDefault();
        addOrSubtractPage(e, book, BookDiv);
    })

    BookDiv.id = title.textContent + pagesTotal.textContent;
    updateBackground(book, BookDiv);

    BookGrid.appendChild(BookDiv);
}

function createBookGrid () {
    BookGrid = document.createElement('div');
    BookGrid.classList.add('bookGrid');
    document.body.appendChild(BookGrid);
}


function resetBookGrid() {
    BookGrid.querySelectorAll('.BookDiv').forEach(n => n.remove());
}

function closeModal () {
    modal.style.display ='none';
    document.getElementById('titleInput').value ='';
    document.getElementById('authorInput').value='';
    document.getElementById('totalPagesInput').value='';
    document.getElementById('readPagesInput').value='';
    [...document.getElementsByClassName('smiley')].forEach(smiley => smiley.style.display = 'none')
}

function updateCounter() {
    let counterBooks = document.getElementById('booksCounter');
    let counterReadBooks = document.getElementById('booksReadCounter');
    let counterTotalPages = document.getElementById('totalPagesCounter');
    let counterReadPages = document.getElementById('readPagesCounter');

    let readPages = 0;
    let finishedBooks = 0;
    let totalPages = 0;

    for (let i=0; i < myLibrary.length; i++){
        readPages+= myLibrary[i].read;
        totalPages+= myLibrary[i].pages;
        if (myLibrary[i].status == "Finished"){
            finishedBooks += 1;
        }
    }
    

    counterBooks.textContent = `Books: ${myLibrary.length}`;
    counterReadBooks.textContent = `Books read: ${finishedBooks}`;
    counterReadPages.textContent = `Pages read: ${readPages}`;
    counterTotalPages.textContent = `Total pages: ${totalPages}`;
}

function deleteBook(e) {
    let objectDelete = myLibrary.filter(obj =>{
        return obj.title + obj.pages  == e.target.closest('.bookDiv').id;
    })
    let positionDelete = myLibrary.indexOf(objectDelete[0]);
    let splicedPart = myLibrary.splice(positionDelete);
    splicedPart.shift();
    myLibrary = myLibrary.concat(splicedPart);

    resetBookGrid();
    showBooks();
}

let titleEdit = '';
let authorEdit = '';
let pagesEdit = '';
let readEdit = '';

function editBook (BookDiv, book) {
    bookToEdit = book;
    modal.style.display ="flex";
    titleInput.value = BookDiv.querySelector('.bookTitle').textContent;
    readPagesInput.value = BookDiv.querySelector('.pagesRead').textContent;
    totalPagesInput.value = BookDiv.querySelector('.pagesTotal').textContent;
    let authorWithoutBy = BookDiv.querySelector('.bookAuthor').textContent.replace('by ', '');
    authorInput.value = authorWithoutBy;
}

function changeBook (){
    resetBookGrid();
    bookIndex = myLibrary.indexOf(bookToEdit);
    myLibrary[bookIndex].title = document.getElementById('titleInput').value;
    myLibrary[bookIndex].author = document.getElementById('authorInput').value;
    myLibrary[bookIndex].pages = Number(document.getElementById('totalPagesInput').value);
    myLibrary[bookIndex].read= Number(document.getElementById('readPagesInput').value);
    showBooks();
    closeModal();
    updateBackground(bookToEdit, document.getElementById(bookToEdit.title+bookToEdit.pages))
}

function addOrSubtractPage (e, book, BookDiv){
    bookIndex = myLibrary.indexOf(book);
    pages = Number(BookDiv.querySelector('.pagesRead').textContent)

    switch (e.target.textContent) {
        case '+':
            if (book.read == book.pages){
                return;
            }
            myLibrary[bookIndex].read += 1;
            pages += 1;
        break;
        case '-':
            if (book.read == 0){
                return;
            }
            myLibrary[bookIndex].read -= 1;
            pages -= 1;
        break;
        case '✔':
            myLibrary[bookIndex].read = myLibrary[bookIndex].pages;
            pages = myLibrary[bookIndex].pages;
        break;
    }
    BookDiv.querySelector('.pagesRead').textContent = pages;
    updateBackground(book, BookDiv);
    updateCounter();
    populateStorage();
}

function createStatus (book) {

    if (book.pages == book.read){
        book.status = "Finished";
    } else if (book.read == 0){
        book.status = "Not started";
    } else {
        book.status = "Reading"
    }
}

function updateBackground(book, BookDiv) {
    createStatus(book);
    switch (book.status){
        case 'Finished':
        BookDiv.style.backgroundColor = "#90EE90";
        break;
        case 'Reading':
        BookDiv.style.backgroundColor = "lavender";
        break;
        case 'Not started':
        BookDiv.style.backgroundColor = "grey";
        break;
    }
}

function checkForError () {
    ErrorMessage.textContent = '';
    ErrorMessage.style.cssText =' color: red; width: 100%;text-align:center;'
    if (Number(document.getElementById('readPagesInput').value) > Number(document.getElementById('totalPagesInput').value) || Number(document.getElementById('readPagesInput').value) < 0){
        ErrorMessage.textContent = 'Read pages need to be over 0 and under total pages';
    }
    else if (document.getElementById('titleInput').value == ''){
        ErrorMessage.textContent = 'Every book needs a title';
    }
    else if (document.getElementById('authorInput').value == ''){
        ErrorMessage.textContent = 'Every book needs an author';
    }
    document.getElementById('pagesDiv').appendChild(ErrorMessage); 
}


function changeSmiley () {
    [...document.getElementsByClassName('smiley')].forEach(smiley => smiley.style.display = 'none')

    if (Number(document.getElementById('readPagesInput').value) == Number(document.getElementById('totalPagesInput').value)){
        document.getElementById('s3').style.display = 'inline'; 
    } else if (Number(document.getElementById('readPagesInput').value) == 0){
        document.getElementById('s1').style.display = 'inline';
    } else if ((Number(document.getElementById('readPagesInput').value < 0)) || (Number(document.getElementById('readPagesInput').value) > Number(document.getElementById('totalPagesInput').value))) {
        [...document.getElementsByClassName('smiley')].forEach(smiley => smiley.style.display = 'none')
    } else {
        document.getElementById('s2').style.display = 'inline';
    }
}

function validate(e){
    var theEvent = e || window.event;

  if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
  } else {
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

function giveTitleClass(title) {

    if (title.textContent.length > 30){
        return 'biggestTitle';
    }
    else if(title.textContent.length > 15){
        return 'biggerTitle';
    }
    else {
        return 'bookTitle';
    }
}

//Storage

function populateStorage () {
    if (myLibrary != null){
    localStorage.setItem('UsersLibrary', JSON.stringify(myLibrary));
    }
}

function loadLibrary (){
    let myLibraryString = localStorage.getItem('UsersLibrary');
    myLibrary = JSON.parse(myLibraryString);
    if (myLibrary == null){
        return;
    } else {
    showBooks();
    }
}
// Events

addBookButton.onclick = () => {modal.style.display = "flex"; bookToEdit = '';}
submitNewBookButton.addEventListener('click', function(e) {
    e.preventDefault();
    checkForError();
    if (ErrorMessage.textContent != ''){
        return;
    }
    else if(bookToEdit == ''){
    addBookToLibrary();
    }
    else {
    changeBook();   
    }
})
document.addEventListener('click', function(e) {
    if (e.target ==  modal){
        closeModal();
    }
})

InputsArray = [...document.getElementsByClassName('pagesInput')]
InputsArray.forEach (input => input.addEventListener('input', (e) =>{
    e.preventDefault();
    validate(e);
    changeSmiley();
}))

createBookGrid();
loadLibrary();