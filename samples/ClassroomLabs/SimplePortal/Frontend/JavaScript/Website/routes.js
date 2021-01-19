var appRouter = function (app) {
    
    var lab1 = {
        "id": 1,
        "name": "hyperv-using-ui",
        "course": "Agriculture 340",
        "description": "Materials to teach ArcGIC",
        "classtype": "Windows 10",
        "size": "Small GPU"
    };
    var lab2 = {
        "id": 2,
        "name": "hyperv-using-ui",
        "description": "Agriculture 340",
        "course": "Materials to teach ArcGIC",
        "classtype": "Windows 10",
        "size": "Small GPU"
    };
    const data = { 
        "templates": ["Template 1", "Template 2"], 
        "content": [lab1, lab2] 
    };

    function getClass(req, res) {
        res.send(JSON.stringify(data));
    }

    app.get("/api/Classes", getClass);

    app.post("/api/Classes/Create", function (req, res) {

        var newID = data.content.length + 1;
        var parameters = {
            "id": newID,
            "name": req.body.name,
            "course": "Class 101",
            "description": "Class with " + req.body.template,
            "classtype": "Windows 10",
            "size": "Small"
        };
        data.content.push(parameters);

        getClass(req, res);
    });
}

module.exports = appRouter;