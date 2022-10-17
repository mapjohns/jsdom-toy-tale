let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


let toys

fetch("http://localhost:3000/toys")
.then(response => response.json())
.then(json => toys = json)

function addToysToPage(toys) {
  for (let i=0; i<toys.length; i++) {
    let getToy = document.createElement('div')
    getToy.classList.add('card')

    // Add name
    let toyName = document.createElement('h2')
    toyName.innerHTML = toys[i].name
    getToy.append(toyName)

    // Add img
    let toyImage = document.createElement('img')
      toyImage.src = toys[i].image
      toyImage.classList.add("toy-avatar")
      getToy.append(toyImage)

    // Add likes
    let toyLikes = document.createElement('p')
    toyLikes.innerHTML = `${toys[i].likes} Likes `
    getToy.append(toyLikes)

    // Add button
    let toyLikeButton = document.createElement('button')
    toyLikeButton.classList.add('like-btn')
    toyLikeButton.innerHTML = "Like"
    getToy.append(toyLikeButton)

    // Add to Toy Collection
    let toyCollection = document.getElementById('toy-collection')
    toyCollection.append(getToy)
}
}
setTimeout(()=>addToysToPage(toys), 1000)


// Add New Toy to Collection
document.querySelector('input.submit').addEventListener('click', addNewToy)

function addNewToy(e) {
  e.preventDefault();
  return fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify({
          name: document.querySelector('.add-toy-form :nth-child(2)').value,
          image: document.querySelector('.add-toy-form :nth-child(4)').value,
          likes: 0
      })
  })
  .then(function(response) {
      return response.json()
  })
  .then(function(object) {
    let test = [object]
    addToysToPage(test)
    document.querySelector('.add-toy-form :nth-child(2)').value = ""
    document.querySelector('.add-toy-form :nth-child(4)').value = ""
    })
  .catch(function(error) {
  let errMessage = document.createElement('h3')
  errMessage.innerHTML = error.message
  document.body.append(errMessage)
  });
}

// Increase Toy likes
function addLikeListener() {
  let likeButtons = document.querySelectorAll('.like-btn')
  for (let i=0; i<likeButtons.length; i++) {
    likeButtons[i].addEventListener('click', increaseLikes)
  }
}

setTimeout(() => addLikeListener(), 1500)

let testing

function increaseLikes(e) {
  testing = e
  let id
  for (let i=0; i<testing.path[1].parentElement.children.length; i++) {
    if (testing.path[1].parentElement.children[i].childNodes[0].innerHTML === testing.path[1].childNodes[0].innerHTML) {
        id = i + 1
    }
  }


  let likes = testing.path[1].querySelector("p").innerText.slice(0,-6)
  return fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({
        likes: parseInt(likes) + 1
    })
  })
    .then(function(response) {
      return response.json()
  })
  .then(function() {
    testing.path[1].querySelector("p").innerText = `${parseInt(likes) + 1} Likes`})
}