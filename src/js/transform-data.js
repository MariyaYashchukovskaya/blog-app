function buildDate (date) {
  const dateCreate = new Date(date)
  const day = transformData(dateCreate.getDate())
  const month = transformData(dateCreate.getMonth() + 1)
  const year = dateCreate.getFullYear()

  return `${day}.${month}.${year}`
}

function transformData (time) {
  return time < 10 ? `0${time}` : time
}

function selectTypePost (type) {
  switch (type) {
    case '1':
      type = 'Спорт'
      break
    case '2':
      type = 'Туризм'
      break
    case '3':
      type = 'Бизнес'
      break
  }
  return type
}

export { buildDate, selectTypePost }
