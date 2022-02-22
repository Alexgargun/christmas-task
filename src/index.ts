import data from './data.js'

// Card with toys

const generateCard = (num:string, name:string, count:string, year:string,shape:string, color:string, size:string, favorite:boolean) => {
  return `
  <div class="card" data-num="${num}">
    <h2 class="card-title">${name}</h2>
    <img src="./assets/toys/${num}.png" alt="" class="card-img">
    <div class="card-description">
        <p class="count">Количество: ${count}</p>
        <p class="year">Год покупки: ${year}</p>
        <p class="shape">Форма: ${shape}</p>
        <p class="color">Цвет: ${color}</p>
        <p class="size">Размер: ${size}</p>
        <p class="favorite">Любимая: ${favorite}</p>
    </div>
    <div class="ribbon"></div>
  </div>
  `
}

const cardContainer:any = document.querySelector('.card-container')

const cardHTML = data.map(item => {
  const {num, name, count, year, shape, color, size, favorite} = item
  return generateCard(num, name, count, year, shape, color, size, favorite)
}).join('')

cardContainer.innerHTML = cardHTML

const switchStartPage:any = document.querySelector('.switch-start-page')
const startPage:any = document.querySelector('.start-page')
const mainPage:any = document.querySelector('.main-page')
const logo:any = document.querySelector('.logo')
const favoritesPage:any = document.querySelector('.favorites-page')
mainPage.classList.add('hide')
switchStartPage.onclick = function() {
  startPage.classList.add('hide')
  favoritesPage.classList.add('hide')
  mainPage.classList.remove('hide')

}

let switchMainPage:HTMLElement = document.querySelector('.switch-main-page')!


let switchFavoritePage:HTMLElement = document.querySelector('.switch-favorite-page')!

switchMainPage.addEventListener('click', () => {
  switchMainPage.classList.add('active-link')
  switchFavoritePage.classList.remove('active-link')
  startPage.classList.add('hide')
  favoritesPage.classList.add('hide')
  mainPage.classList.remove('hide')
}) 

switchFavoritePage.addEventListener('click', () => {
  switchMainPage.classList.remove('active-link')
  switchFavoritePage.classList.add('active-link')
  startPage.classList.add('hide')
  favoritesPage.classList.remove('hide')
  mainPage.classList.add('hide')
})

logo.addEventListener('click', () => {
  startPage.classList.remove('hide')
  mainPage.classList.add('hide')
  favoritesPage.classList.add('hide')
})

// Add toys to favorites

const newData = data.slice(0, 20)
console.log(newData)

const favoritesContainer:any = document.querySelector('.favorites-container')
const card = document.querySelectorAll('.card')

const generateToysCard = (num:string, count:string) => {
  return `
  <div class="favorites-card"  data-num=${num}>
    <p class="favorites-count">${count}</p>
    <img src="./assets/toys/${num}.png" alt="" class="favorites-card-img" draggable="true" data-toynum="${num}">
  </div>  
  `
}

const toysHTML = newData.map(item => {
  const {num, count} = item
  return generateToysCard(num, count)
}).join('')

favoritesContainer.innerHTML = toysHTML

// Tree container
const mainTree:any = document.querySelector('.main-tree')
const tree:any = document.querySelectorAll('.tree')
mainTree.src =  `assets/tree/${JSON.parse(localStorage.getItem('treenumber')!)}.png`


tree.forEach((treeItem: { addEventListener: (arg0: string, arg1: (e: any) => void) => void }) => {
  treeItem.addEventListener('click', (e) => {
    mainTree.src = `assets/tree/${e.target.dataset.tree}.png`
    localStorage.setItem('treenumber', JSON.stringify(e.target.dataset.tree))
    console.log(e.target.dataset.tree)
  })
});

//bg-container
const mainTreeContainer:HTMLElement = document.querySelector('.main-tree-container')!
const bg:any = document.querySelectorAll('.bg')

mainTreeContainer.style.backgroundImage = `url(./assets/bg/${JSON.parse(localStorage.getItem('bg-num')!)}.jpg)`



bg.forEach((element: { addEventListener: (arg0: string, arg1: (e: any) => void) => void }) => {
  element.addEventListener('click', (e: { target: { dataset: { bg: any } } }) => {
    mainTreeContainer.style.backgroundImage = `url(./assets/bg/${e.target.dataset.bg}.jpg)`
    localStorage.setItem('bg-num', JSON.stringify(e.target.dataset.bg))
  })
});

// Audio control

const audioControl:Element = document.querySelector('.audio-control')!
const audio:any = document.querySelector('audio')!
localStorage.setItem('audio', JSON.stringify(audio))
function playPause() {
  const method = audio.paused ? 'play' : 'pause'
  audio[method]()
  audioControl.classList.toggle('active')
}

audioControl.addEventListener('click', playPause)

//snow flake

const snowControl:any = document.querySelector('.snow-control')
const pageContainer = document.querySelector('.page-container')

let interval: NodeJS.Timer
let isSnowing: boolean = false

// LocalStorage for snow

function snowSetLocalStorage() {
  localStorage.setItem('snow', JSON.stringify(isSnowing))
}

window.addEventListener('beforeunload', snowSetLocalStorage)

function snowGetLocalStorage() {
  if (localStorage.getItem('snow')) {
    isSnowing = JSON.parse(localStorage.getItem('snow')!)
  }
}

window.addEventListener('load', snowGetLocalStorage)

snowControl.addEventListener('click', startSnow)

// it doesn't work because of addEventListener - click  >>> I'll back to it later)

function startSnow() {
  if (isSnowing == false) {
    interval  = setInterval(createSnowFlake, 100)
    isSnowing = true
  } else {
    clearInterval(interval)
    isSnowing = false
  }
}


function createSnowFlake() {
	const snowFlake:any = document.createElement('i');
	snowFlake.classList.add('fas');
	snowFlake.classList.add('fa-snowflake');
	snowFlake.style.left = Math.random() * window.innerWidth + 'px';
	snowFlake.style.animationDuration = Math.random() * 3 + 2 + 's'; 
	snowFlake.style.opacity = Math.random();
	snowFlake.style.fontSize = Math.random() * 10 + 10 + 'px';
	
  mainTreeContainer.prepend(snowFlake);

	setTimeout(() => {
		snowFlake.remove();
	}, 2000)
}

createSnowFlake()

// Drag & Drop toys

const toy = document.querySelectorAll('.favorites-card')
const treeMap:any = document.querySelector('map')!

treeMap.addEventListener('dragover', dragOverHandler)
treeMap.addEventListener('drop', dropHandler)

function dragOverHandler(event: { preventDefault: () => void }) {
  event.preventDefault();
}

function dropHandler(event: { dataTransfer: { getData: (arg0: string) => any }; clientX: string; clientY: string }) {
  const dragFlag = event.dataTransfer.getData('dragItem')
  const dragItem:any = document.querySelector(`[data-toynum="${dragFlag}"]`)
  dragItem.style.left = event.clientX + 'px';
  dragItem.style.top = event.clientY + 'px';
  treeMap.append(dragItem)
}

toy.forEach((dragItem:any) => {
  dragItem.addEventListener('dragstart', function(event: { dataTransfer: { setData: (arg0: string, arg1: any) => void } }) {
    event.dataTransfer.setData('dragItem', dragItem.dataset.num)
    console.log('dragstart', event)
  })
})



