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

  const newToyForm = document.querySelector('.add-toy-form');
  newToyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewToy(e);
    e.target.reset();
  })

  getToys();


});

function getToys() {
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(data => renderAllToys(data))
}

function renderAllToys(toys) {
  toys.forEach(toy => renderToy(toy));
}

function renderToy(toy) {
  const toyContainer = document.getElementById('toy-collection');

  const toyCard = document.createElement('div');
  const toyHeader = document.createElement('h2');
  const toyAvatar = document.createElement('img');
  const toyLikes = document.createElement('p');
  const toyButton = document.createElement('button');

  toyCard.classList.add('card');
  toyAvatar.classList.add('toy-avatar');
  toyButton.classList.add('like-btn');
  toyHeader.innerText = toy.name;
  toyAvatar.src = toy.image;
  toyLikes.dataset['likes'] = toy.likes;
  toyLikes.innerText = `${toy.likes} likes`;
  toyLikes.classList.add('like-container');
  toyButton.innerText = 'Like'
  toyButton.id = toy.id;

  toyButton.addEventListener('click', addToyLike);

  toyCard.appendChild(toyHeader)
  toyCard.appendChild(toyAvatar)
  toyCard.appendChild(toyLikes)
  toyCard.appendChild(toyButton);
  toyCard.id = 'toy-' + toy.id

  toyContainer.appendChild(toyCard);
}

function addNewToy(e) {
  const name = e.target.querySelector('[name=name]').value;
  const image = e.target.querySelector('[name=image]').value;
  const newToy = {
    name,
    image,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(newToy),
  })
    .then(res => res.json())
    .then(data => {
      if (data.name) renderToy(data);
    });
}

function addToyLike() {
  const id = this.id;
  const toyLikeContainer = document.querySelector(`#toy-${id} .like-container`);
  const newLikes = parseInt(toyLikeContainer.dataset['likes'], 10) + 1;
  console.log(newLikes)
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ likes: newLikes })
  }).then(res => res.json())
    .then(data => {
      if (data.name) {
        console.log(data);
        toyLikeContainer.innerText = `${data.likes} like(s)`;
        toyLikeContainer.dataset.likes = data.likes;
      }
    })
}