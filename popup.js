let vocabularies = {}

const formElement = document.querySelector('.form')
const listElement = document.querySelector('.list-items')
const clearElement = document.querySelector('.clear-all')
const copyElement = document.querySelector('.copy')

chrome.storage.sync.get('data', ({data}) => {
  if (data) {
    for (const key in data) {
      appendItem(key, data[key])
    }

    vocabularies = data
  }
})

formElement.addEventListener('submit', async (event) => {
  event.preventDefault()
  const {english, vietnamese} = event.target.elements

  if (english.value && vietnamese.value) {
    vocabularies[english.value] = vietnamese.value

    chrome.storage.sync.set({data: vocabularies}, function () {
      appendItem(english.value, vietnamese.value)
      formElement.reset()
    })
  }
})

function appendItem(enValue, viValue) {
  const liElement = document.createElement('li')
  const enElement = document.createElement('span')
  const viElement = document.createElement('span')
  const removeElement = document.createElement('button')

  liElement.className = 'item'
  removeElement.innerHTML = 'X'
  removeElement.className = 'remove'
  removeElement.addEventListener('click', handleItemRemove)

  enElement.innerHTML = enValue
  viElement.innerHTML = viValue

  liElement.append(enElement, viElement, removeElement)
  listElement.appendChild(liElement)
}

copyElement.addEventListener('click', handleBtnCopy)
clearElement.addEventListener('click', handleBtnClearAll)

function handleItemRemove(event) {
  const previousElement =
    event.target.previousElementSibling.previousElementSibling

  const key = previousElement.textContent
  delete vocabularies[key]

  chrome.storage.sync.set({data: vocabularies}, function () {
    event.target.parentNode.remove()
  })
}

async function handleBtnCopy() {
  let copyString = ''

  for (const en in vocabularies) {
    const vi = vocabularies[en]
    copyString += `${en}\t${vi}\n`
  }

  await navigator.clipboard.writeText(copyString)
}

function handleBtnClearAll() {
  chrome.storage.sync.remove('data', function () {
    if (listElement.hasChildNodes()) {
      Array.from(listElement.childNodes).forEach((child) => child.remove())
    }
  })
}
