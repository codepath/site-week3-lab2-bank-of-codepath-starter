const dateFormatter = new Intl.DateTimeFormat("en-US", {})

export const formatDate = (date) => {
  const d = date ? new Date(date) : null
  return d instanceof Date ? dateFormatter.format(d) : ""
}

const formatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatAmount = (amount) => {
  const dollars = amount * 0.01
  return Number.isNaN(dollars) ? null : `$${formatter.format(dollars)}`
}
