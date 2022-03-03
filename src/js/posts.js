class Posts {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.baseUrl = '/api/posts'

    this.init()
  }

  init () {
    document.addEventListener('DOMContentLoaded', this.handleDOMReady.bind(this))
    window.addEventListener('form.sent', this.handleDataSent.bind(this))
    this.containerElement.addEventListener('click', this.handlePostSend.bind(this))
    this.containerElement.addEventListener('click', this.handlePostShow.bind(this))
  }

  handlePostShow (event) {
    const { target } = event

    target.classList.add('active')
  }

  handlePostSend (event) {
    const { target } = event
    const { id } = target.dataset

    if (target.dataset.role !== 'edit') return

    fetch(`${this.baseUrl}/${id}`)
      .then(response => response.json())
      .then(data => {
        const eventCustom = new CustomEvent('post.clicked', {
          detail: { data }
        })
        window.dispatchEvent(eventCustom)
      })
  }

  handleDOMReady () {
    fetch(this.baseUrl)
      .then(response => response.json())
      .then(data => {
        const { list } = data
        this.render(list)
      })
  }

  handleDataSent ({ detail }) {
    const { data } = detail

    this.render(data.list)
  }

  buildTemplate (data) {
    const date = new Date(data.createdAt)
    const dateCreateAt = this.buildDate(date)

    return `
    <div class="island__item" data-id="${data.id}" data-role="edit">
    <h4>${data.title}</h4>
    <time class="text-muted">${dateCreateAt}</time>
    </div>
    `
  }

  buildDate (data) {
    const day = this.transformData(data.getDate())
    const month = this.transformData(data.getMonth() + 1)
    const year = data.getFullYear()
    return `${day}.${month}.${year}`
  }

  transformData (time) {
    return time < 10 ? `0${time}` : time
  }

  render (data) {
    const templates = data.map(item => {
      return this.buildTemplate(item)
    })

    this.containerElement.innerHTML = templates.join('')
  }
}

export { Posts }
