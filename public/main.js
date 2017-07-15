$('#register').on('submit', function (event) {
    event.preventDefault();
    var name = $('#register-name').val();
    var email = $('#register-email').val();
    var password = $('#register-password').val();
    var passwordConfirm = $('#register-password-confirm').val();

    var promise = $.post('http://localhost:3000/api/register', { name: name, email: email, password: password, passwordConfirm: passwordConfirm });
    promise.then(function (response) {
        $("#register-errors").empty();

        if (response.status == "fail") {
            $("#register-errors").append("<p>" + response.message + "</p>");
        } else if (response.status == "success") {
            window.location.href = '/index/login';
        }
    })
})

$('#login').on('submit', function (event) {
    event.preventDefault();
    var email = $('#login-email').val();
    var password = $('#login-password').val();
    var passwordConfirm = $('#login-password-confirmˇ').val();

    var promise = $.post('http://localhost:3000/api/login', { email: email, password: password, passwordConfirm: passwordConfirm });
    promise.then(function (response) {
        $("#login-errors").empty();

        if (response.status == "fail") {
            $("#login-errors").append("<p>" + response.message + "</p>");
        } else if (response.status == "success") {
            window.location.href = '/dashboard';
        }
    })
})

$('#add-snippet').on('submit', function (event) {
    event.preventDefault();
    var name = $('#add-name').val();
    var content = $('#add-content').val();
    var notes = $('#add-notes').val();
    var language = $('#add-language').val();
    var tag = $('#add-tag').val();

    var promise = $.post('http://localhost:3000/api/add-snippet', { name: name, content: content, notes: notes, language: language, tag: tag });
    promise.then(function (response) {
        $("#add-snippet-errors").empty();
        $("#add-snippet-success").empty();

        if (response.status == "fail") {
            $("#add-snippet-errors").append("<p>" + response.message + "</p>");
        } else if (response.status == "success") {
            $('#add-snippet').each(function () {
                this.reset();
            });
            $("#add-snippet-success").append("<p>Snippet successfuly added.</p>");
        }
    })
})

if (window.location.pathname == '/dashboard') {
    $.get("/api/all-snippets", function (data) {
        var data = data.data;
        for (var i = 0; i < data.length; i++) {
            var notes = data[i].notes;
            var tags = data[i].tags;

            if (notes == null) {
                notes = '';
            }
            if (tags == null) {
                tags = '';
            }

            $('.all-snippets').append($('<div class="snippets">' +
                '<p class="name">Snippet Name: ' + data[i].name + '</p>' +
                '<p class="content">Snippet: ' + data[i].content + '</p>' +
                '<p class="language">Code Language: ' + data[i].language + '</p>' +
                '<p class="date-added">Added on ' + data[i].dateAdded + ' by ' + data[i].user.name + '</p>' +
                '<p class="notes">Notes: ' + notes + '</p>' +
                '<p class="tags">Related Tags: ' + tags + '</p>' +
                '<button class="view-snippet" value="' + data[i].id + '"> View Snippet </button>' +
                '</div>'));
        }

        // takes you to route for the single snippet which will then show a page with just that snippets information on it
        $('.view-snippet').click(function (event) {
            window.location.href = '/dashboard/' + this.value;
        })
    });
}

$('.language-button').click(function (event) {
    var languageChoice = $('select[name=language]').val()
    if (languageChoice == 'all') {
        window.location.href = '/dashboard';
    } else {
        var promise = $.post('http://localhost:3000/api/all-snippets/language', { language: languageChoice });
        promise.then(function (response) {
            $(".all-snippets").empty();
            var response = response.data;
            for (var i = 0; i < response.length; i++) {
                var notes = response[i].notes;
                var tags = response[i].tags;

                if (notes == null) {
                    notes = '';
                }
                if (tags == null) {
                    tags = '';
                }

                $('.all-snippets').append($('<div class="snippets">' +
                    '<p class="name">Snippet Name: ' + response[i].name + '</p>' +
                    '<p class="content">Snippet: ' + response[i].content + '</p>' +
                    '<p class="language">Code Language: ' + response[i].language + '</p>' +
                    '<p class="date-added">Added on ' + response[i].dateAdded + ' by ' + response[i].user.name + '</p>' +
                    '<p class="notes">Notes: ' + notes + '</p>' +
                    '<p class="tags">Related Tags: ' + tags + '</p>' +
                    '<button class="view-snippet" value="' + response[i].id + '"> View Snippet </button>' +
                    '</div>'));
            }

            // takes you to route for the single snippet which will then show a page with just that snippets information on it
            $('.view-snippet').click(function (event) {
                window.location.href = '/dashboard/' + this.value;
            })
        });
    }
});

$('#tag-form').on('submit', function (event) {
    event.preventDefault();
    var tag = $('#tag-text').val();

    var promise = $.post('http://localhost:3000/api/all-snippets/tag', { tag: tag });
    promise.then(function (response) {
        $(".all-snippets").empty();
        var response = response.data;
        for (var i = 0; i < response.length; i++) {
            var notes = response[i].notes;
            var tags = response[i].tags;

            if (notes == null) {
                notes = '';
            }
            if (tags == null) {
                tags = '';
            }

            $('.all-snippets').append($('<div class="snippets">' +
                '<p class="name">Snippet Name: ' + response[i].name + '</p>' +
                '<p class="content">Snippet: ' + response[i].content + '</p>' +
                '<p class="language">Code Language: ' + response[i].language + '</p>' +
                '<p class="date-added">Added on ' + response[i].dateAdded + ' by ' + response[i].user.name + '</p>' +
                '<p class="notes">Notes: ' + notes + '</p>' +
                '<p class="tags">Related Tags: ' + tags + '</p>' +
                '<button class="view-snippet" value="' + response[i].id + '"> View Snippet </button>' +
                '</div>'));
        }

        // takes you to route for the single snippet which will then show a page with just that snippets information on it
        $('.view-snippet').click(function (event) {
            window.location.href = '/dashboard/' + this.value;
        })

    })
})