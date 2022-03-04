class Post {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.baseUrl = '/api/posts'
    this.init()
  }

  init () {
    window.addEventListener('post.clicked', this.handlePostClicked.bind(this))
  }

  handlePostClicked ({ detail }) {
    const { data } = detail
    this.render(data)
  }

  buildTemplate (data) {
    const typePost = this.selectTypePost(data.select)
    const date = new Date(data.createdAt)
    const dateCreateAt = this.buildDate(date)
    return `
    <div class="island__item" data-id="${data.id}">
    <h4>${data.title}</h4>
    <p>${data.content}</p>
    <p>${data.author}</p>
    <p>${typePost}</p>
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

  selectTypePost (typePost) {
    switch (typePost) {
      case '1':
        typePost = 'Спорт'
        break
      case '2':
        typePost = 'Туризм'
        break
      case '3':
        typePost = 'Бизнес'
        break
    }
    return typePost
  }

  render (data) {
    const templates = this.buildTemplate(data)
    this.containerElement.innerHTML = templates
  }
}

export { Post }
