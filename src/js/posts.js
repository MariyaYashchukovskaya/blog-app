import { template } from 'lodash'

class Posts {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.baseUrl = '/api/posts'
    this.activeElement = null
    this.templateElement = document.querySelector('#templatePosts')
    this.titleSearch = ''
    this.inputFilterElement = document.querySelector('#search')
    this.init()
  }

  init () {
    document.addEventListener('DOMContentLoaded', this.handleDOMReady.bind(this))
    window.addEventListener('form.sent', this.handleDataSent.bind(this))
    this.containerElement.addEventListener('click', this.handlePostSend.bind(this))
    window.addEventListener('post.removed', this.handlePostRemove.bind(this))
    this.inputFilterElement.addEventListener('input', this.handlePostFilter.bind(this))
  }

  async handlePostSend (event) {
    const { target } = event
    const { id } = target.dataset
    if (target.dataset.role !== 'clicked') return

    const listItemElement = target.closest('.island__item')
    if (listItemElement) {
      this.toggleActiveListElement(listItemElement)
    }
    const response = await fetch(`${this.baseUrl}/${id}`)
    const data = await response.json()

    const customEvent = new CustomEvent('post.clicked', {
      detail: { data }
    })
    window.dispatchEvent(customEvent)
  }

  toggleActiveListElement (listItemElement) {
    if (this.activeElement) {
      this.activeElement.classList.remove('island__item_active')
    }
    listItemElement.classList.add('island__item_active')
    this.activeElement = listItemElement
  }

  handlePostRemove (event) {
    const { data } = event.detail
    this.render(data.list)
  }

  async handleDOMReady () {
    const response = await fetch(this.baseUrl)
    const data = await response.json()
    const { list } = data
    this.render(list)
  }

  handlePostFilter (event) {
    const { target } = event
    const searchString = target.value
    const matches = this.titleSearch.filter((item) => item.title.includes(searchString))
    console.log(matches)
    this.render(matches)
  }

  handleDataSent ({ detail }) {
    const { data } = detail
    this.render(data.list)
    this.titleSearch = data.list
  }

  buildTemplate (data) {
    const templateHtml = this.templateElement.innerHTML
    const compiled = template(templateHtml)
    const result = compiled(data)
    return result
  }

  render (data) {
    const templates = data.map(item => {
      return this.buildTemplate(item)
    })
    this.containerElement.innerHTML = templates.join('')
  }
}

export { Posts }
