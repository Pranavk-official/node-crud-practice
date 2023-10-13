/**
 * GET /
 * Homepage
 */




exports.homepage = async (req,res) => {
    const locals = {
        title: "NodeJs",
        description: ""
    }

    res.render('index', locals)
}