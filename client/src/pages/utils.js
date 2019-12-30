function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDate()
  const hour = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')

  return `${year}-${month+1}-${day} ${hour}:${minutes}`
}

export {
  formatDate
}
