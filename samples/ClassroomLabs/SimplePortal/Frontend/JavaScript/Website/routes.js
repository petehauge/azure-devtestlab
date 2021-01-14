var appRouter = function (app) {
    
    var data1 = {
        "id": 1,
        "name": "hyperv-using-ui",
        "course": "Agriculture 340",
        "description": "Materials to teach ArcGIC",
        "classtype": "Windows 10",
        "size": "Small GPU"
    };
    var data2 = {
        "id": 2,
        "name": "hyperv-using-ui",
        "description": "Agriculture 340",
        "course": "Materials to teach ArcGIC",
        "classtype": "Windows 10",
        "size": "Small GPU"
    };
    const data = [data1, data2];

    app.get("/api/Classes", getClass);

    app.post("/api/Classes/Create", function (req, res) {

        var parameters = {
            "id": data.length + 1,
            "name": req.body,
            "course": "Agriculture 100",
            "description": "HW",
            "classtype": "Windows 10",
            "size": "Small GPU"
        };
        data.push(parameters);

        getClass(req, res);
    });

    function getClass(req, res) {
        res.send(JSON.stringify(data));
    }
}

module.exports = appRouter;