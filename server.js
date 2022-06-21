/**
 * TESTED ON
 * Web Browser: Brave Desktop V1.39.111
 * Node.js: v17.9.0
 * Express: v4.18.1
 */

const express = require('./node_modules/express');
const port = 5000;

/** ------------------------------------------------------------------------ */

/** BUILT-IN MODULES */
const fs = require('fs');
const path = require('path')

const multimedia_template = fs.readFileSync('ostalo/multimedija.html', {encoding: 'utf-8'});
const songs_template = fs.readFileSync('podaci/popis.html', {encoding: 'utf-8'});

const createFigureComponent = (src, caption) =>
    `<figure class="text-justify"><img class="icon-media thumbnail" src="${src}" alt="${src}"/><figcaption>${caption}</figcaption></figure>`;

const createVideoComponent = (src, type, poster) =>
    `<video class="icon-media thumbnail" poster="${poster}" controls><source src="${src}" type="${type}">Vaš Web preglednik ne podržava video!</video>`

const createAudioComponent = (src, type) =>
    `<audio controls muted><source src="${src}" type="${type}"/>Vaš Web preglednik ne podržava audio!</audio>`

/**
 * Class HTMLTable models HTML table representation.
 */
class HTMLTable {
    /**
     * Initializes empty HTML table with given caption
     * @param {string} caption
     */
    constructor(caption) {
        this.table = `<table><caption>${caption}</caption><thead>@headerRow</thead><tbody>@bodyRow</tbody></table>`
    }

    /**
     * Adds header row to the HTML table
     * @param {string[]} data
     */
    addHeaderRow(data) {
        let rowContent = '';
        data.forEach(td => rowContent += `<th>${td}</th>`);
        this.table = this.table.replace('@headerRow', `${this.#createRow(rowContent)}`);
    }

    /**
     * Adds body row to the HTML table
     * @param {string[]} data
     */
    addBodyRow(data) {
        let rowContent = '';
        data.forEach(td => rowContent += `<td>${td}</td>`);
        this.table = this.table.replace('@bodyRow', `${this.#createRow(rowContent)}@bodyRow`);
    }

    /**
     * HTML table in string representation.
     * @returns {string} HTML table representation
     */
    getTable = () =>
        this.table.replace('@bodyRow', '');

    /**
     * Helper method used for creating HTML table row
     * @param {string} rowContents
     * @returns {string} HTML table row with given rowContents
     */
    #createRow = (rowContents) =>
        `<tr>${rowContents}</tr>`;
}

/** WEB APPLICATION */
const app = express();

app.use('/materijali', express.static(__dirname + '/materijali'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/prijava.html'));
})

app.post('/login', (req, res) => {
    res.redirect('/index');
});

app.get('/logout', (req, res) => {
    res.redirect('/login');
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, '/obrazac.html'));
});

app.get('/data/songs', (req, res) => {
    const songs = fs.readFileSync('datoteke/songs.csv', {encoding: 'utf-8'});
    let page = songs_template;

    const table = new HTMLTable('Glazbeni proizvodi Elvisa Presleya');
    const rows = songs.split('\n');
    table.addHeaderRow(rows[0].split(';'));

    for (let i = 1; i < rows.length; i++)
        table.addBodyRow(rows[i].split(';'));

    page = page.replace('@table', table.getTable());
    res.setHeader("Content-Type", "text/html")
    res.send(page);
});

app.get('/data/books', (req, res) => {
    res.sendFile(path.join(__dirname, '/podaci/pregled.html'));
});

app.get('/other/author', (req, res) => {
    res.sendFile(path.join(__dirname, '/ostalo/o_autoru.html'));
});

app.get('/other/multimedia', (req, res) => {
    const multimedia = JSON.parse(fs.readFileSync('datoteke/multimedia.json', {encoding: 'utf-8'}));
    let page = multimedia_template;

    let imgs = '';
    for (const imgObj of multimedia[0])
        imgs += createFigureComponent(imgObj.src, imgObj.caption);
    page = page.replace('@img', imgs);

    let videos = '';
    for (const videoObj of multimedia[1])
        videos += createVideoComponent(videoObj.src, videoObj.type, videoObj.poster);
    page = page.replace('@video', videos);

    let audios = '';
    for (const audioObj of multimedia[2])
        audios += createAudioComponent(audioObj.src, audioObj.type);
    page = page.replace('@audio', audios);

    res.setHeader("Content-Type", "text/html")
    res.send(page);
});

app.get('/other/creative', (req, res) => {
    res.sendFile(path.join(__dirname, '/ostalo/kreativna.html'));
});

app.get('/other/design', (req, res) => {
    res.sendFile(path.join(__dirname, '/ostalo/dizajn.html'));
});

app.listen(port, () =>
    console.log(`App started at ${new Date().toLocaleString()} on port ${port}!`)
);
