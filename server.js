//Configuração do Servidor
const express = require("express")
const server = express()

//Configuração de arquivos estáticos(extras)
server.use(express.static('public'))

//Habilitar body
server.use(express.urlencoded({ extended: true }))

//Configuração da conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'dev2019',
    host: 'localhost',
    port: '5432',
    database: 'donorsbank'
})

//Configuração do Nunjucks(Template Engine)
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

//Configurar a apresentação da página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados")
        const donors = result.rows

        return res.render("index.html", { donors })
    })
    
})
server.post("/", function(req, res) {
    //Pega dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios")
    }

    //Coloca os dados no banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function(err){
        //Fluxo de erro
        if(err) return res.send("Erro no banco de dados"+err)

        //Fluxo ideal .Redireciona para o index
        return res.redirect("/")
    })

})

//Ligar servidor na porta 3000
server.listen(3000, function() {
    console.log("Servidor inicializado com sucesso")
})

// Lista de Doadores