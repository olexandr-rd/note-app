const selectElement = document.body.querySelector('#categoryInput');
const notesTable = document.body.querySelector('#notes');
const archiveTable = document.body.querySelector('#archived');
const noteForm = document.body.querySelector('#noteForm');


const categories = ['Task', 'Random Thought', 'Idea'];
categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    selectElement.appendChild(option);
});


class Note {
    name;
    created;
    category;
    content;
    dates;
    isArchived;
    static noteIdCounter = 0;

    constructor(name, category, content, created = new Date()) {
        this.name = name;
        this.created = created.toDateString().slice(3);
        this.category = category;
        this.content = content;
        const matches = content.match(/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[1,2])\/(19|20)\d{2}/gm);
        this.dates = matches ? matches.join(', ') : '';
        this.isArchived = false;
        this.id = Note.noteIdCounter++;
    }
}


// Initial notes
let notes = [
    new Note('Shopping', categories[0], 'Strawberry, cream', new Date(2023, 3, 13)),
    new Note('What if...', categories[1], 'What if Kennedy hadn\'t been killed 22/11/1963', new Date(2023, 5, 30)),
    new Note('Dishes', categories[0], 'Do dishes after lunch', new Date(2022, 11, 31)),
    new Note('Use map()', categories[2], 'I can use Array.prototype.map()', new Date(2023, 2, 8)),
    new Note('Home-task', categories[0], 'Should finish on 12/08/2022', new Date(2022, 7, 7)),
    new Note('Use EventListener', categories[2], 'I can use addEventListener to dynamically change something', new Date(2022, 1, 30)),
    new Note('What was...', categories[1], 'What was I made for?...', new Date(2023, 2, 10))
]

const appendTable = (note) => notesTable.appendChild(createNoteRow(note));
notes.forEach(note => appendTable((note)));


// New notes
function createNoteRow(note) {
    const noteRow = document.createElement('tr');
    noteRow.classList.add('table-row');
    noteRow.dataset.noteId = note.id;
    noteRow.innerHTML = `
    <td>${note.name}</td>
    <td>${note.created}</td>
    <td>${note.category}</td>
    <td>${note.content}</td>
    <td>${note.dates}</td>
    <div class="controls">
        <button>Edit</button>
        <button onclick="archiveNote(this)">Archive</button>
        <button onclick="deleteNote(this)">Delete</button>
    </div>`;

    return noteRow;
}

noteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = Array.from((new FormData(noteForm)).values());
    const newNote = new Note(...formData);

    notes.push(newNote);
    appendTable(newNote);
    
    noteForm.reset();
    displayForm();
});


// Deleting notes
function deleteNote(button) {
    const row = button.closest('tr');
    const noteId = Number(row.dataset.noteId);
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    notes.splice(noteIndex, 1);
    row.remove();
}

function deleteAllNotes(button) {
    const table = button.closest('table');
    const rows = table.querySelectorAll('.table-row');
    notes = notes.filter(note => note.isArchived === (table.id === 'notes'));
    for (let row of rows) row.remove();
}


function archiveNote(button) {
    let row = button.closest('tr');
    const noteId = Number(row.dataset.noteId);
    const note = notes.find((note) => note.id === noteId);
    note.isArchived = !note.isArchived;
    moveRow(row, note.isArchived);
}

function moveRow(row, isArchived) {
    if (isArchived) {
        notesTable.removeChild(row);
        archiveTable.appendChild(row);
    } else {
        archiveTable.removeChild(row);
        notesTable.appendChild(row);
    }
}


function archiveAllNotes(button) {
    let table = button.closest('table');
    const isArchived = table.id === 'notes';
    notes.forEach(note => note.isArchived = isArchived);
    const rows = table.querySelectorAll('.table-row');
    for (let row of rows) moveRow(row, isArchived);
}

const displayForm = () => document.body.querySelector('#noteForm').classList.toggle('open');