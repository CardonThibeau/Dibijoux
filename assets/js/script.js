//------------------------------------------- Service Worker -------------------------------------------
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/Dibijoux/sw.js', { scope: '/Dibijoux/' }).then(function(reg) {

        if(reg.installing) {
            console.log('Service worker installing');
        } else if(reg.waiting) {
            console.log('Service worker installed');
        } else if(reg.active) {
            console.log('Service worker active');
        }

    }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}
//var productService = require('productService.js');
//var swRegister = require('swRegister.js');
/*

 window.pageEvents = {
 loadProductPage: function (productID) {
 productService.loadProductPage(productID);
 },
 loadMore: function () {
 productService.loadMoreRequest();
 }
 }

 productService.loadMoreRequest();
 */
//------------------------------------------- document.ready -------------------------------------------

$(document).ready(function () {
    $("#FAQs .question").on("click", FAQpopup);
});

var FAQpopup = function () {
    if ($(this).parent().is('.open')) {
        $(this).closest('.faq').find('.answer').hide();
        $(this).closest('.faq').removeClass('open');

    } else {
        $(this).closest('.faq').find('.answer').show();
        $(this).closest('.faq').addClass('open');
    }
};

var needShop = function () {
    var href = document.location.href;
    var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);
    var final = lastPathSegment.substr(0, lastPathSegment.lastIndexOf('.'));
    if (final == "shop") {
        var categorie = lastPathSegment.substr(lastPathSegment.lastIndexOf('=') + 1);
        getProductByCategorie(categorie);
    } else if (final == "index") {
        getAllProducts();
        var slideIndex = 1;
        showDivs(slideIndex);
    }
};

//------------------------------------------- create Indexed DB -------------------------------------------

window.indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
if (!window.indexedDB) {
    alert("Your browser doesn't support a stable version of IndexedDB. Offline-support will not be available.");
}

const dbName = "ProductDatabase";
const productData = [
    {productname: "ring1", price: "€10.00", imageurl: "products/ring1.jpg", categorie: "rings"},
    {productname: "ring2", price: "€20.00", imageurl: "products/ring2.jpg", categorie: "rings"},
    {productname: "ring3", price: "€30.00", imageurl: "products/ring3.jpg", categorie: "rings"},
    {productname: "ring4", price: "€40.00", imageurl: "products/ring4.jpg", categorie: "rings"},
    {productname: "ring5", price: "€50.00", imageurl: "products/ring5.jpg", categorie: "rings"},
    {productname: "ring6", price: "€60.00", imageurl: "products/ring6.jpg", categorie: "rings"},
    {productname: "ring7", price: "€70.00", imageurl: "products/ring7.jpg", categorie: "rings"},
    {productname: "ring8", price: "€80.00", imageurl: "products/ring8.jpg", categorie: "rings"},
    {productname: "bracelet1", price: "€15.00", imageurl: "products/bracelet1.jpg", categorie: "bracelets"},
    {productname: "bracelet2", price: "€25.00", imageurl: "products/bracelet2.jpg", categorie: "bracelets"},
    {productname: "bracelet3", price: "€18.00", imageurl: "products/bracelet3.jpg", categorie: "bracelets"},
    {productname: "necklace1", price: "€30.00", imageurl: "products/necklace1.jpg", categorie: "necklaces"},
    {productname: "necklace2", price: "€30.00", imageurl: "products/necklace2.jpg", categorie: "necklaces"},
    {productname: "earring1", price: "10.00", imageurl: "products/earring1.jpg", categorie: "earrings"},
    {productname: "watch1", price: "100.00", imageurl: "products/watch1.jpg", categorie: "watches"},
    {productname: "watch2", price: "90.00", imageurl: "products/watch2.jpg", categorie: "watches"},
];

var request = window.indexedDB.open(dbName, 2);
var db;

request.onerror = function (e) {
    alert("something went wrong" + e.target.errorCode);
}


request.onupgradeneeded = function (e) {
    db = e.target.result;
    var os = db.createObjectStore("products", {autoIncrement: true});
    os.createIndex("productname", "productname", {unique: false});
    os.createIndex("categorie", "categorie", {unique: false});

    os.transaction.oncomplete = function (event) {
        console.log("database created");
        var productObjectStore = db.transaction("products", "readwrite").objectStore("products");
        productData.forEach(function (product) {
            console.log("product added: " + product.productname);
            productObjectStore.add(product);
        });
    }
}


//------------------------------------------- fetch Indexed DB -------------------------------------------

request.onsuccess = function (e) {
    db = e.target.result;
    needShop();
}

var getProductByCategorie = function (categorie) {
    var trans = db.transaction(["products"]);
    var os = trans.objectStore("products");

    var request = os.getAll();
    request.onerror = function (e) {
        alert("Couldn't get all products: " + e.target.errorCode);
    }
    request.onsuccess = function (e) {
        var at = request.result.length;
        for (var i = 0; i < at; i++) {
            if (request.result[i].categorie == categorie) {
                $("#shopproducts").append("<figure>" + "<img src='" + request.result[i].imageurl + "'>" + "<figcaption>" + request.result[i].productname + " " + request.result[i].price  + " </figcaption> " + "</figure>" );
            }
        }
    }
};

var getAllProducts = function () {
    console.log("begin gathering all");
    var trans = db.transaction(["products"]);
    var os = trans.objectStore("products");

    var request = os.getAll();
    request.onerror = function (e) {
        alert("Couldn't get all products: " + e.target.errorCode);
    }
    request.onsuccess = function (e) {
        var at = request.result.length;
        console.log("All " + at + " products gathered");
        for (var i = 0; i < at; i++) {
            $("#hotproducts").append("<img class='mySlides' src='" + request.result[i].imageurl + "'>");
            var helper = i + 1;
            $("#littlehotproducts").append("<img class='demo' src='" + request.result[i].imageurl + "' onclick=currentDiv(" + helper + ")>");
        }
        console.log("end gathering all");
    }
};

//------------------------------------------- slideshow -------------------------------------------
function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    if (n > x.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = x.length
    }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    console.log(x);
    x[slideIndex - 1].style.display = "block";
}