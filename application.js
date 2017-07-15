const express = require('express');
const fs = require('file-system');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const moment = require('moment');
const models = require('./models');
const salt = "this is a salt";
moment().format();

const application = express();

application.engine('handlebars', expressHandlebars());
application.set('view engine', 'handlebars');

application.use(session({
    secret: 'secretcookiekey',
    resave: false,
    saveUninitialized: true
}));

application.use('/public', express.static('./public'));

application.use(bodyParser.urlencoded());

application.get('/', (request, response) => {
    return response.status(200).redirect('/index');
});

application.get('/index', (request, response) => {
    return response.status(200).render('index');
});

application.get('/index/login', (request, response) => {
    return response.status(200).render('login');
});

application.get('/index/register', (request, response) => {
    return response.status(200).render('register');
});

application.get('/dashboard', asyncWrap(async (request, response) => {
    if (!request.session.isAuthenticated) {
        return response.redirect('/index');
    } else {
        var languages = []
        var snippetQuery = { where: { userId: request.session.userId }, include: models.users };
        var findSnippets = await models.snippets.findAll(snippetQuery);
        for (let i = 0; i < findSnippets.length; i++) {
            if (languages.indexOf(findSnippets[i].language) == -1) {
                languages.push(findSnippets[i].language);
            }
        }

        var model = {
            languages: languages
        }

        return response.status(200).render('dashboard', model);
    }
}));

application.get('/dashboard/add-snippet', (request, response) => {
    if (!request.session.isAuthenticated) {
        return response.redirect('/index');
    } else {
        return response.status(200).render('add-snippet');
    }
});

application.get('/dashboard/:snippetId', async (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/index');
    } else {
        var snippetId = parseInt(request.params.snippetId);
        var snippetQuery = { where: { id: snippetId }, include: models.users };

        var singleSnippet = await models.snippets.find(snippetQuery);

        var notes = singleSnippet.notes;
        var tags = singleSnippet.tags;

        if (notes == null) {
            notes = '';
        }

        if (tags == null) {
            tags = '';
        }

        var model = {
            name: singleSnippet.name,
            content: singleSnippet.content,
            notes: notes,
            language: singleSnippet.language,
            tags: tags,
            date: singleSnippet.dateAdded,
            addedBy: singleSnippet.user.name
        }

        response.status(200).render('single-snippet', model);
    }
})

application.post('/api/register', async (request, response) => {
    var name = request.body.name;
    var email = request.body.email;
    var password = request.body.password;
    var passwordConfirm = request.body.passwordConfirm;

    if (!name || !email || !password || !passwordConfirm) {
        var model = {
            status: "fail",
            message: "Please ensure you have entered all required fields"
        }

        response.json(model);
    } else if (password != passwordConfirm) {
        var model = {
            status: "fail",
            message: "Please ensure that your password matches the confirmation match."
        }

        response.json(model);
    } else {
        var emailCheck = await models.users.find({ where: { email: email } });

        if (emailCheck) {
            var model = {
                status: "fail",
                message: "This email is already in the system, please choose a new one"
            }

            response.json(model);
        } else {
            var registerHashed = crypto.pbkdf2Sync(password, salt, 10, 512, "sha512").toString("base64");

            var register = await models.users.create({
                name: name,
                email: email,
                password: registerHashed
            });

            var model = {
                status: "success"
            }
            response.json(model);
        }
    }
});

application.post('/api/login', async (request, response) => {
    var email = request.body.email;
    var password = request.body.password;

    if (!email || !password) {
        var model = {
            status: "fail",
            message: "Please ensure you have entered all required fields"
        }
        response.json(model);
    } else {
        var loginHashed = crypto.pbkdf2Sync(password, salt, 10, 512, "sha512").toString("base64");

        // think about separating the userCheck with just a check for user, then when user is found check passwords for better error messages
        var userCheck = await models.users.find({ where: { email: email, password: loginHashed } });

        if (!userCheck) {
            var model = {
                status: "fail",
                message: "Email or password incorrect"
            }
            response.json(model);
        } else {
            request.session.isAuthenticated = true;
            request.session.userId = userCheck.dataValues.id;
            var model = {
                status: "success"
            }
            response.json(model);
        }
    }
})

application.get('/api/all-snippets', async (request, response) => {
    var userId = request.session.userId;

    var snippetQuery = { where: { userId: userId }, include: models.users };
    var findSnippets = await models.snippets.findAll(snippetQuery);

    var model = {
        status: "success",
        data: findSnippets
    }

    response.json(model);
})

application.post('/api/all-snippets/language', async (request, response) => {
    var language = request.body.language;
    var userId = request.session.userId;

    var snippetQuery = { where: { userId: userId, language: language }, include: models.users };
    var findSnippets = await models.snippets.findAll(snippetQuery);

    var model = {
        status: "success",
        data: findSnippets
    }
    response.json(model);
})

application.post('/api/all-snippets/tag', async (request, response) => {
    var tag = request.body.tag;
    var userId = request.session.userId;

    var snippetQuery = { where: { userId: userId, tags: {$like: '%' + tag + '%'} }, include: models.users };
    var findSnippets = await models.snippets.findAll(snippetQuery);

    var model = {
        status: "success",
        data: findSnippets
    }
    response.json(model);
})

application.post('/api/add-snippet', async (request, response) => {
    var snippetName = request.body.name;
    var snippetContent = request.body.content;
    var snippetNotes = request.body.notes;
    var snippetLanguage = request.body.language;
    var snippetTag = request.body.tags
    var dateAdded = moment().format("ddd, MMM Do YYYY")
    var userId = request.session.userId;


    if (!snippetName || !snippetContent || !snippetLanguage) {
        var model = {
            status: "fail",
            message: "Name, content and language are all required to add a snippet"
        }

        response.json(model);
    } else {
        if (snippetNotes == "") {
            snippetNotes = null;
        } else if (snippetTag == "") {
            snippetTag = null;
        }

        var newSnippet = await models.snippets.create({
            name: snippetName,
            content: snippetContent,
            notes: snippetNotes,
            language: snippetLanguage,
            tags: snippetTag,
            dateAdded: dateAdded,
            userId: userId
        });

        var model = {
            status: "success",
        }

        response.json(model);
    }
})

module.exports = application;