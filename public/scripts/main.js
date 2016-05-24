/*  Using Global Scope. Very bad.  If interacting with other scripts, must namespace/modulerize */

/* Script contents should be in external file, but kept in here for demo purposes */

    document.addEventListener("DOMContentLoaded", function(event) {
        loadList();
    });

    /*  variable used to store templates in a cache to prevent multiple requests on static file */
    var templatesCache = [];
    var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
    };

    /**
     *   Checks if template exists in the cache.  If so, calls displayTemplate.
     *   If not, first loads template and adds it to cache before calling displayTemplate.
     */
     function loadTemplate(name, data) {
        /* Check template cache to see if template has been loaded.  If so, immediately call displayTemplate() */
        if (templatesCache[name]) {
            displayTemplate(templatesCache[name], data);
        }
        else {
            /* If template is not in cache, use Ajax to fetch template, then store in cache and call displayTemplate() */
            $.get('/views/' + name + '.ejs', function(template) {
                templatesCache[name] = template;
                displayTemplate(template, data);
            });
        }
    }

    /**
     * Takes template string and data and uses EJS to render them together.
     * Then displays the new HTML inside of the display div.
     */
    function displayTemplate(template, data) {
        var snippet = ejs.render(template, data);
        document.getElementById('display').innerHTML = snippet;
    }

    /**
     *  Uses Ajax to get the book list data from the server.
     */
    function loadList() {
        var sort = getUrlParameter('sort');
        var order = getUrlParameter('order');
        var tag = getUrlParameter('tag');
        var search = getUrlParameter('search');
        var args = "";
        if(sort)
        {
            args = "?sort="+sort+"&order="+order;
        }
        if(search)
        {
            args = "?search="+search;
        }
        if(tag)
        {
            args = "?tag="+tag;
        }
        $.get('/api/bookmarks/'+args, function(books) {
            loadTemplate('assignment2', {books: books});
        });
    }

    function getCSV(){

        //$("#download").click(function() {

        console.log("clicked");

        $.get('/api/bookmarks/', function(books){

                console.log(books);
                window.open("data:text/csv;charset=utf-8," + escape(csv));
        });
        //});
    }


    /**
     *  Displays the confirm delete page for the passed in book.
     */
    function confirmDelete(id) {
        var title = document.getElementById('title' + id).innerHTML;
        var url = document.getElementById('url' + id).innerHTML;
        var keywords = document.getElementById('keywords' + id).innerHTML;
        var book = {id: id, title: title, url:url, tags: keywords};

        loadTemplate('delete', {book: book});
    }

    /**
     *  Uses Ajax to get delete the book from the server.  Calls loadList on success.
     */
    function deleteBook(id) {
        $.ajax({
            url: '/api/bookmarks/' + id,
            type: 'DELETE',
            success: function(res) {
                loadList();
            }
        });
    }

    /**
     *  Displays the add book page.
     */
    function showAdd() {
        loadTemplate('add');
    }

    /**
     *  Uses Ajax to add the new book from the server.  Calls loadList on success.
     */
    function addBook() {
        var title = document.getElementById('title');
        var url = document.getElementById('url');
        var keywords = document.getElementById('keywords');
        var description = document.getElementById('description');
        var star = document.getElementById('star');
        $.ajax({
            url: '/api/bookmarks/',
            data: 'title=' + title.value + '&url=' + url.value + '&keywords=' + keywords.value + '&description=' + description.value + '&star=' + star.value,
            type: 'POST',
            success: function(res) {
                loadList();
            }
        });
    }

    /**
     *  Displays the edit book page for the passed in book.
     */
    function showEdit(id) {
        var title = document.getElementById('title' + id).innerHTML;
        var keywords = document.getElementById('keywords' + id).innerHTML;
        var description = document.getElementById('description' + id).innerHTML;
        var star = document.getElementById('star' + id).innerHTML;
        var url = document.getElementById('url' + id).innerHTML;
        var check = "";
        var check2 = "";
        console.log(keywords);
        if(star == "1") check = "selected";
        else check2 = "selected";
        var book = {id: id, title: title, url: url, description: description, keywords: keywords, yes: check, star: star, no: check2 };
        loadTemplate('edit', {book: book});
    }

    /**
     *  Uses Ajax to get update the book on the server.  Calls loadList on success.
     */
    function updateBook(id) {
        var title = document.getElementById('edittitle' + id).value;

        var star = document.getElementById('editstar' + id).value;
        console.log(star);
        var description = document.getElementById('editdescription' + id).value;
        var keywords = document.getElementById('editkeywords' + id).value;
        var url = document.getElementById('editurl' + id).value;
        var title = document.getElementById('edittitle' + id).value;
        
        $.ajax({
            url: '/api/bookmarks/' + id,
            data: 'title=' + title + '&url=' + url + '&keywords=' + keywords + '&description=' + description + '&star=' + star,
            type: 'PUT',
            success: function(res) {
                loadList();
            }
        });
    }