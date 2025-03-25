async function getSecret (context, key) {
  if (!context) {
    throw new Error('Context for secrets has not been loaded.')
  }
  return await context.secrets.get(key)
}

async function storeSecret (context, key, value) {
  if (!context) {
    throw new Error('Context for secrets has not been loaded.')
  }
  await context.secrets.store(key, value)
}

async function deleteSecret (context, key) {
  if (!context) {
    throw new Error('Context for secrets has not been loaded.')
  }
  await context.secrets.delete(key)
}

module.exports = {
  getSecret,
  storeSecret,
  deleteSecret
}
