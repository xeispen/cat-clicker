document.addEventListener("DOMContentLoaded", function(event) {

    localStorage.clear()

    var catArray = [["Lebron James","Lebron James.jpg"],
                    ["Chris Paul","Chris Paul.jpg"],
                    ["Stephen Curry","Stephen Curry.jpg"],
                    ["Demar Derozan","Demar Derozan.jpg"],
                    ["Joel Embiid","Joel Embiid.jpg"]];

    // This is called an object literal
    var model = {
        init: function () {
            if (!localStorage.cats) {
                // Turns a Javascript object into JSON text
                // and stores that JSON text in a string
                localStorage.cats = JSON.stringify([]);
            };
            if (!localStorage.admin) {
                // Turns a Javascript object into JSON text
                // and stores that JSON text in a string
                localStorage.admin = JSON.stringify({admin: 0});
            };
        },

        admintoggle: function() {
            var status = JSON.parse(localStorage.admin);
            if (status.admin == 0) {
                status.admin = 1;
            } else {
                status.admin = 0;
            };
            localStorage.admin = JSON.stringify(status);
        },

        admincurr: function() {
            var status = JSON.parse(localStorage.admin);
            return status.admin
        },

        add: function(obj) {
            // Turns a string of JSON text into a Javascript object
            var data = JSON.parse(localStorage.cats);
            data.push(obj);
            localStorage.cats = JSON.stringify(data);
        },

        getAllCats: function() {
            return JSON.parse(localStorage.cats);
        },

        getCat: function(cat) {
            var data = model.getAllCats();
            for (var i = 0; i < data.length; i++) {
                if (data[i].name === cat) {
                    return data[i];
                };
            };
        },

        // modify cat

        modCat: function(cat) {
            currCat = octopus.currCat();
            data = model.getAllCats();
            for (var i = 0; i < data.length; i++) {
                if (data[i].name === currCat) {
                    data[i] = cat;
                };
            };
            localStorage.cats = JSON.stringify(data);
            octopus.refresh(cat);
        },



        increment: function(cat) {
            var data = model.getAllCats();
            for (var i = 0; i < data.length; i++) {
                if (data[i].name === cat) {
                    data[i].clickCt ++;
                    var catMod = data[i];
                };
            };
            localStorage.cats = JSON.stringify(data);
            // Refresh picture
            octopus.refresh(catMod);
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
        },

        // Returns JavaScript Object of Cats from localStorage.cats
        getCats: function() {
            return model.getAllCats();
        },


        getCat: function() {
            // gets the cat name
            var currCat = catview.catshown();
            return model.getCat(currCat);
        },

        // returns current name of cat shown so model knows
        // which cat to modify
        modCat: function(newcat) {
            model.modCat(newcat)
        },

        currCat: function() {
            return catview.catshown();
        },

        pushCt: function() {
            //get the specific cat
            var catName = catview.catshown();
            //call function to model
            model.increment(catName);
        },

        refresh: function (cat) {
            listview.bindlist();
            catview.renderCat(cat);
        },

        init: function () {
            model.init();
            listview.init();
        },

        toggle: function () {
            model.admintoggle();
            var admin = model.admincurr();
            if (admin == 1) {
                adminview.init();
            } else {
                adminview.closeAdmin();
            };
        },

        adminstatus: function () {
            return model.admincurr();
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
            listview.bindlist();
        },

        bindlist: function() {
            listview.clearlist();
            octopus.getCats().forEach( function(cat) {
                    // Create list element use this.var to store
                    var catItem = document.createElement('li');
                    catItem.textContent = cat.name;
                    // Assigns event listener to cat list item
                    catItem.addEventListener('click', (function() {
                        // Call renderCat function when the item is clicked
                        return catview.renderCat(cat);
                    }));
                listview.render(catItem);
            });
        },

        clearlist: function() {
            document.getElementById("cat-list").innerHTML = '';
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

        // Init method
        init: function() {
            var catPic = document.getElementById('cat-pic');
            var adminDiv = document.getElementById('admin-but');
            var adminButton = document.createElement('button');
            adminButton.setAttribute('id','admin-button');
            adminButton.innerHTML = 'Admin';


            // TODO: add logical check to see if button already exists
            var existingAdmin = document.getElementById('admin-button');

            catPic.addEventListener('click', catview.increment);
            adminButton.addEventListener('click', octopus.toggle);

            if (existingAdmin == null && octopus.adminstatus() == 0) {
                adminDiv.appendChild(adminButton);
            };
            if (octopus.adminstatus() == 1) {
                adminview.init();
            };

        },

        increment: function() {
            octopus.pushCt();
        },

        catshown: function() {
            return document.getElementById("cat-header").innerHTML;
        }
    };


    var adminview = {
        init: function() {
            // Initialize elements
            var outerDiv = document.createElement('div');
            var form = document.createElement('form');
            var catname = document.createElement('input');
            var file = document.createElement('input');
            var clicks = document.createElement('input');

            var l_catname = document.createElement('label');
            var l_file = document.createElement('label');
            var l_clicks = document.createElement('label');

            var submit = document.createElement('button');
            var cancel = document.createElement('button');

            submit.addEventListener('click', function() {
                // Call octopus function to update value
                var newCatname = document.getElementById('name').value;
                var newFile = document.getElementById('file').value;
                var newClicks = document.getElementById('clicks').value;

                // Add single cat
                var newCat = {
                    name: newCatname,
                    file: newFile,
                    clickCt: Number(newClicks)
                };

                octopus.modCat(newCat);

                adminview.init();
            });

            cancel.addEventListener('click', function() {
                octopus.toggle();
            });



            submit.innerHTML = 'Save';
            cancel.innerHTML = 'Cancel';

            outerDiv.setAttribute('id','admin')
            l_catname.setAttribute('for','name');
            l_file.setAttribute('for','file');
            l_clicks.setAttribute('for','clicks');

            l_catname.innerHTML = 'Cat Name:';
            l_file.innerHTML = 'File Name:';
            l_clicks.innerHTML = '# of Clicks:';

            form.name = 'catForm';

            catname.type = 'text';
            file.type = 'text';
            clicks.type = 'text';

            catname.id = 'name';
            file.id = 'file';
            clicks.id = 'clicks';

            var br1 = document.createElement('br');
            var br2 = document.createElement('br');
            var br3 = document.createElement('br');
            // TODO: Event listeners
            // TODO: Call octopus function to grab values for specific cat
            var cat = octopus.getCat();

            // Set value of form with the cat returned
            catname.value = cat.name;
            file.value = cat.file;
            clicks.value = cat.clickCt;

            // Appends to outerDiv to get it ready for rendering
            form.appendChild(l_catname);
            form.appendChild(catname);
            form.appendChild(br1);
            form.appendChild(l_file);
            form.appendChild(file);
            form.appendChild(br2);
            form.appendChild(l_clicks);
            form.appendChild(clicks);
            form.appendChild(br3);
            form.appendChild(submit);
            form.appendChild(cancel);
            outerDiv.appendChild(form);

            // Call render function
            adminview.renderAdmin(outerDiv);
        },

        renderAdmin: function(admin) {
            // var cat = octopus.getCat();
            var outerDiv = document.getElementById('admin');
            if (outerDiv != null) {
                outerDiv.parentNode.removeChild(outerDiv);
            };
            var left = document.getElementById('left');
            left.appendChild(admin);
            var adminBut = document.getElementById('admin-button');
            if (adminBut != null) {
                adminBut.parentNode.removeChild(adminBut);
            };
        },

        closeAdmin: function() {
            var outerDiv = document.getElementById('admin');
            if (outerDiv != null) {
                outerDiv.parentNode.removeChild(outerDiv);
            };
            catview.init();
        }


    };


    octopus.init()


});
