import { marked } from 'marked'
import { template } from 'lodash'
import { selectTypePost } from './transform-data'
class Post {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.baseUrl = '/api/posts'
    this.url = ''
    this.currentPost = ''
    this.templateElement = document.querySelector('#template')
    this.init()
  }

  init () {
    window.addEventListener('post.clicked', this.handlePostClicked.bind(this))
    window.addEventListener('post.edited', this.handlePostEdited.bind(this))
    this.containerElement.addEventListener('click', this.handleClickButtonRemove.bind(this))
    this.containerElement.addEventListener('click', this.handleClickButtonEdit.bind(this))
  }

  handlePostClicked ({ detail }) {
    const { data } = detail
    this.currentPost = data

    this.url = `${this.baseUrl}/${data.id}`
    this.render(data)
  }

  async handleClickButtonRemove (event) {
    const { role } = event.target.dataset
    if (role === 'remove') {
      const response = await fetch(this.url, {
        method: 'DELETE'
      })
      const data = await response.json()

      const customEvent = new CustomEvent('post.removed', {
        detail: { data }
      })
      window.dispatchEvent(customEvent)
      this.containerElement.innerHTML = ''
    }
  }

  handlePostEdited ({ detail }) {
    const { post } = detail

    this.render(post)
  }

  handleClickButtonEdit (event) {
    const { role } = event.target.dataset
    if (role === 'edit') {
      const customEvent = new CustomEvent('post.edit', {
        detail: { data: this.currentPost }
      })

      window.dispatchEvent(customEvent)
    }
  }

  buildTemplate (data) {
    const templateHtml = this.templateElement.innerHTML

    data.selectType = selectTypePost(data.select)
    console.log(data)
    data.html = marked.parse(data.contentMd)

    const compiled = template(templateHtml)
    const result = compiled(data)

    return result
  }

  render (data) {
    const templates = this.buildTemplate(data)
    this.containerElement.innerHTML = templates
  }
}

export { Post }
