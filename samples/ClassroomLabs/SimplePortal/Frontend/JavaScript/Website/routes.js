var appRouter = function(app) {

    app.get("/api/Classes", function(req, res) {
        res.send("Hello World");
    });
}

module.exports = appRouter;