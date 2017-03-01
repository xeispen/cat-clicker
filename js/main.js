document.addEventListener("DOMContentLoaded", function(event) {

    localStorage.clear()

    var catArray = [["Lebron James","Lebron James.jpg"],
                    ["Chris Paul","Chris Paul.jpg"],
                    ["Stephen Curry","Stephen Curry.jpg"],
                    ["Demar Derozan","Demar Derozan.jpg"],
                    ["Enes Kanter","Enes Kanter.jpg"]];

    // This is called an object literal
    var model = {
        init: function () {
            if (!localStorage.cats) {
                // Turns a Javascript object into JSON text
                // and stores that JSON text in a string
                localStorage.cats = JSON.stringify([]);
            }
        },

        add: function(obj) {
            // Turns a string of JSON text into a Javascript object
            var data = JSON.parse(localStorage.cats);
            data.push(obj);
            localStorage.cats = JSON.stringify(data);
        },

        getAllCats: function() {
            return JSON.parse(localStorage.cats);
        }


    };



    var octopus = {
        // Add cats to local storage
        addCats: function(catArray) {
            for (var i = 0; i < catArray.length; i++) {
                model.add({
                    name: catArray[i][0],
                    file: catArray[i][1],
                    clickCt: 0
                });
            }
            //listview.renderList();
        },

        // Returns JavaScript Object of Cats from localStorage.cats
        getCats: function() {
            return model.getAllCats();
        },

        init: function () {
            model.init();
            listview.init();
        }
    };



    var listview = {
        init: function() {
            // Call octopus.addCats() to add cats to local storage
            octopus.addCats(catArray);
            // set the listview to the cat-list
            this.catUl = document.getElementById("cat-list");
            // Get cats back from local storage to process
            // Executes a function to add Event listener
            octopus.getCats().forEach( function(cat) {
                // Create list element use this.var to store
                var catItem = document.createElement('li');
                catItem.textContent = cat.name;
                catItem.addEventListener('click', (function() {
                    // Call renderCat
                    return catview.renderCat(cat);
                }))
                listview.render(catItem);
            })
        },

        render: function(item) {
            this.catUl.appendChild(item);
        }
    };



    var catview = {
        renderCat: function(cat) {
            // Add cat name to header
            document.getElementById("cat-header").innerHTML = cat.name;
            // Add cat picture
            document.getElementById("cat-pic").src = "static/" + cat.file;
            // Add cat count
            document.getElementById("cat-count").innerHTML = cat.clickCt;
            // Call function to  add cat click event listener
            catview.init();
        },

        init: function() {
            var catPic = document.getElementById("cat-pic");
            catPic.addEventListener('click', catview.log);
        },

        log: function() {
            console.log("hello there");
        }



    };



    octopus.init()

});
