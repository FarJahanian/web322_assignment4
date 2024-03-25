/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Farzaneh Jahanian Student ID: 176014215 Date: 3/22/2024
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const path = require("path");

const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home', { page: '/' }); // Pass the active page to the home template
});

app.get('/about', (req, res) => {
    res.render('about', { page: '/about' }); // Pass the active page to the about template
});

app.get("/lego/sets", async (req, res) => {
    try {
        let sets;
        if (req.query.theme) {
            sets = await legoData.getSetsByTheme(req.query.theme);
        } else {
            sets = await legoData.getAllSets();
        }
        res.render('sets', { sets, page: '/lego/sets' }); // Pass the active page to the sets template
    } catch (err) {
        res.status(404).send(err);
    }
});

app.get("/lego/sets/:num", async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.num);
        res.render('set', { set, page: '' }); // No active page for individual set page
    } catch (err) {
        res.status(404).send(err);
    }
});

app.use((req, res, next) => {
    res.status(404).render('404', { message: "I'm sorry, we're unable to find what you're looking for" }); // Pass a message to the 404 template
});

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server is running on port ${HTTP_PORT}`);
    });
});
