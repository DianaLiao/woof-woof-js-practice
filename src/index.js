// fetch them doggos

window.addEventListener('DOMContentLoaded', event => getTheDogs())

function getTheDogs() {
  return fetch("http://localhost:3000/pups")
  .then(resp => resp.json())
  .then(dogs => {
    addDogsToBar(dogs)
  })
}


const dogBar = document.querySelector("div#dog-bar")
const dogInfo = document.querySelector("div#dog-info")
const filterButton = document.querySelector("div#filter-div button")

function addDogsToBar(dogs){
  dogBar.innerHTML = ""
  dogs.forEach(dog => {
    const dogSpan = document.createElement("span")
    dogSpan.classList.add("dog-bar-name")
    dogSpan.setAttribute("data-id", dog.id)
    dogSpan.textContent = dog.name
    dogBar.append(dogSpan)
  })  
}

dogBar.addEventListener("click", event => {
  console.log(`clicketydooo ${event.target}`)

  if (event.target.classList.contains("dog-bar-name")) {
    const dogId = event.target.dataset.id
    fetch ("http://localhost:3000/pups")
      .then(resp => resp.json())
      .then(dogs => fillInDogInfo(dogs, dogId))
  }

})

function fillInDogInfo(dogs, dogId){
  clickedDog = dogs.find(dog => dog.id == dogId)
  let dogStatus = clickedDog.isGoodDog ? "Good Dog!" : "Bad Dog!"

  dogInfo.innerHTML = `
  <img src=${clickedDog.image}>
  <h2>${clickedDog.name}</h2>
  <button>${dogStatus}</button>
  `
  dogInfo.dataset.id = clickedDog.id
}

dogInfo.addEventListener("click", event => {
  if (event.target.tagName === "BUTTON") {
    toggleDog(event)
  }
})

function toggleDog(event){
  const button = event.target
  let newStatus 
  if (button.textContent === "Good Dog!") 
    newStatus = false
  else if (button.textContent === "Bad Dog!")
    newStatus = true
  else
    newStatus = "Something went wrong"
  
  let textStatus = newStatus ? "Good Dog!" : "Bad Dog!"

  fetch(`http://localhost:3000/pups/${dogInfo.dataset.id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({isGoodDog: newStatus})
  })
    .then(resp => resp.json())
    .then(button.textContent = textStatus)  
}


filterButton.addEventListener("click", event => {
  console.log("What do we do now huh")
  const filterOn = "Filter good dogs: ON"
  const filterOff = "Filter good dogs: OFF"
  if (event.target.textContent === filterOff){
    filterButton.textContent = filterOn
    fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(dogs => {
      const goodDogs = dogs.filter(dog => dog.isGoodDog)
      addDogsToBar(goodDogs)
    })
  }
  else if (event.target.textContent === filterOn) {
    filterButton.textContent = filterOff
    getTheDogs()
  }

})

