class Response {
  constructor(data, status) {
    this.message = data;
    this.status = status || 200;
  }
}

module.exports = Response;
