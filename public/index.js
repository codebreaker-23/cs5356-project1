const _products = "./data/products.json"
var current = 0
var data = []

fetch(_products)
    .then((response) => response.json())
    .then((json) =>
        CreateMainSection(json)
    );

var imageSlider = function (json, playDisplay) {

    var getImageAsCard = function (post) {
        const card = document.createElement('div')
        card.className = "image-slide"
        const figure = document.createElement('figure')
        figure.innerHTML = ` <img src=` + post.imageUrl + ` style="height:400px; width:500px;"/> `
        card.appendChild(figure)
        return card
    }

    const imageCards = document.createElement('div')
    var count = 0
    json.forEach(post => {
        var card = getImageAsCard(post)
        imageCards.appendChild(card);
    });

    const slider = document.getElementById('img-slider')
    slider.appendChild(imageCards)
    playDisplay();
}

var CreateMainSection = function (json) {
    data = json
    for (var i = 0; i < json.length; i++) {
        var post = json[i]
        if (post.active) {
            initialize(function () {
                document.getElementById("right_click").disabled = false;
                document.getElementById("left_click").disabled = false;           
                document.getElementById("left_click").addEventListener("click", left_clk);
                document.getElementById("right_click").addEventListener("click", right_clk);
                setItemToDisplay(post)
            })
            break
        }
    }
    imageSlider(json, function () {
        var index = 0
        display();

        function display() {
            var image_slides = document.getElementsByClassName("image-slide");
            for (let i = 0; i < image_slides.length; i++) {
                image_slides[i].style.display = "none";
            }
            index++;
            if (index == image_slides.length) {
                index = 0;
            }
            image_slides[index].style.display = "block";
            setTimeout(display, 2000);
        }
    })
}

// run & deploying
// firebase settings
// Stripe Account settings

var initialize = function (callback) {
    const parent_col = document.createElement('div')
    parent_col.className = 'columns p-6 is-vcentered';

    const child_col_1 = document.createElement('div')
    child_col_1.className = 'column has-text-centered';
    const figure = document.createElement('figure')
    figure.className = "image mx-6 is-centered is-relative"
    figure.innerHTML = ` <img id="product_image" src="" style="height:600px; width:690px;" alt="Placeholder image"/> `
    child_col_1.appendChild(figure)

    const buttons = document.createElement('div')
    
    const left_button = document.createElement('button')
    left_button.id = "left_click"
    left_button.className = "button is-black is-medium mt-3 px-6 mx-6"
    left_button.innerHTML = "<-"
    buttons.appendChild(left_button)

    const right_button = document.createElement('button')
    right_button.id = "right_click"
    right_button.className = "button is-black is-medium mt-3 px-6 mx-6"
    right_button.innerHTML = "->"
    buttons.appendChild(right_button)

    child_col_1.appendChild(buttons)
    parent_col.appendChild(child_col_1)

    const child_col_2 = document.createElement('div')
    child_col_2.className = 'column mx-3';
    const title = document.createElement('p')
    title.id = "product_title"
    title.className = 'title is-size-2 has-text-dark'
    child_col_2.append(title)

    const description = document.createElement('p')
    description.className = "is-heading is-size-4"
    description.id = "product_description"
    child_col_2.append(description)

    const highlights = document.createElement('ul')
    highlights.className = "ul-style is-size-5"
    highlights.id = "features"
    child_col_2.append(highlights)

    const price = document.createElement('p')
    price.className = "pb-4 is-size-4"
    price.id = "product_price"
    child_col_2.append(price)

    const buyButton = document.createElement('a')
    buyButton.className = "button is-black"
    buyButton.id = "product_button"
    buyButton.innerText = 'Buy Now'
    child_col_2.append(buyButton)
    parent_col.appendChild(child_col_2)

    const slider = document.getElementById('products')
    slider.appendChild(parent_col)
    callback();
}

var setItemToDisplay = function (post) {
    document.getElementById("product_image").src = post.imageUrl
    document.getElementById("product_title").innerHTML = post.title
    document.getElementById("product_description").innerHTML = post.description
    document.getElementById("product_button").href = post.paymentLink
    document.getElementById("product_price").innerHTML = "Price: $" + post.price
    var features = document.getElementById("features")
    features.innerHTML = ''
    post.highlighted_features.forEach((item) => {
        const li = document.createElement("li");
        li.className = 'list-item'
        li.innerText = item;
        features.appendChild(li);
    });
}

function left_clk() {
    var n = data.length
    while (current >= 0) {
        var post = data[current]
        current = (current == 0) ? n - 1 : current - 1;
        if (post.active) {
            setItemToDisplay(post)
            console.log(post.paymentLink)
            break
        }
    }
}

function right_clk() {
    var n = data.length
    while (current < data.length) {
        var post = data[current]
        current = (current + 1)%n;
        if (post.active) {
            setItemToDisplay(post)
            break
        }
    }
}
