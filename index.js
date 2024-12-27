const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Assets')));

app.set('view engine', 'ejs');

const filesDir = path.join(__dirname, 'files');

app.get('/', (req, res) => {
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading files');
        }
        res.render('index', { files });
    });
});

app.get('/file/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render("show",{filename:req.params.filename, filedata: filedata});
    })
})

app.post('/create', (req, res) => {
    const { fname, lname, dob, sex, height, weight, contact, email, address, emergency_contact, relation } = req.body;

    const formData = `
    First Name: ${fname}
    Last Name: ${lname}
    Date of Birth: ${dob}
    Sex: ${sex}
    Height: ${height} inches
    Weight: ${weight} pounds
    Contact Number: ${contact}
    Email: ${email}
    Address: ${address}
    Emergency Contact: ${emergency_contact}
    Relation: ${relation}
    `;

    const sanitizedTitle = `${fname}_${lname}_${dob}`.split(' ').join('');
    const filename = `${sanitizedTitle}.txt`;
    const filepath = path.join(filesDir, filename);

    fs.writeFile(filepath, formData, (err) => {
        if (err) {
            return res.status(500).send('Error saving the file');
        }
        res.redirect('/');
    });
});
app.listen(3000);




