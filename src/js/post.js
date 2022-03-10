import { buildDate, selectTypePost } from './transform-data'

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

  handleClickButtonRemove (event) {
    const { role } = event.target.dataset
    if (role === 'remove') {
      fetch(this.url, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          const customEvent = new CustomEvent('post.removed', {
            detail: { data }
          })
          window.dispatchEvent(customEvent)
          this.containerElement.innerHTML = ''
        })
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
    let template = this.templateElement.innerHTML
    const typeSelect = selectTypePost(data.select)
    template = template.replaceAll('{{select}}', typeSelect)
    const date = buildDate(data.createdAt)
    template = template.replaceAll('{{createdAt}}', date)
    for (const key in data) {
      template = template.replaceAll(`{{${key}}}`, data[key])
    }
    return template
    // const typePost = selectTypePost(data.select)
    // const dateCreateAt = buildDate(data.createdAt)
    // return `
    // <div class="island__item" data-id="${data.id}">
    // <h4>${data.title}</h4>
    // <p>${data.content}</p>
    // <p>${data.author}</p>
    // <p>${typePost}</p>
    // <time class="text-muted">${dateCreateAt}</time>
    // </div>
    // <div class="mt-4">
    //     <button class="btn btn-warning" data-role="edit">Редактировать</button>
    //     <button class="btn btn-danger" data-role="remove">Удалить</button>
    //   </div>
    // `
  }

  render (data) {
    const templates = this.buildTemplate(data)
    this.containerElement.innerHTML = templates
  }
}

export { Post }
