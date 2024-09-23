module.exports = {
  apps : [{
    name         : "p1-go-e-relay",
    script       : "./relay.js",
    watch        : true,
    ignore_watch : ["dynamic.json"],
    node_args    : ["--env-file=.env"],
  }]
}
