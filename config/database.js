if(process.env.NODE_ENV === 'production') {
  module.exports = {mongURI: 'mongodb://admin:admin@ds147544.mlab.com:47544/vidya'}
} else {
  module.exports = {mongURI: 'mongodb://admin:admin@ds147544.mlab.com:47544/vidya'}
}
