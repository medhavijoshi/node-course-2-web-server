const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// processs.env heroku env variable or use local 3000
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFileSync('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log.');
        }
    })
    next();
});

// stops everything after it from executing
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

//the html (static middleware)
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        welcome: 'Hello, Express!',
        pageTitle: 'Home Page',
        currentYear: new Date().getFullYear(),
    });
});

app.get('/project', (req, res)=>{
    res.render('project.hbs', {
        pageTitle: 'Projects',
        welcome: 'Port folio page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Could not reach the page',
    });
});

app.listen(port, () => {
    console.log(`App is running ${port}`);
});