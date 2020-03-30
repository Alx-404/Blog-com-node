//CARREGANDO MODULOS
  const express = require('express');
  const handlebars = require('express-handlebars');
  const bodyParser = require('body-parser');
  const app = express();
  const admin = require('./routes/admin')
  const mongoose = require('mongoose');
  const session = require("express-session")
  const flash = require("connect-flash")
  require("./models/Postagem")
  const Postagem = mongoose.model("postagens")
 
  //CONFIGURAÇOES
    //Sessions
      app.use(session({
        secret:"cursodenode",
        resave: true,
        saveUninitialized:true
      }))
      app.use(flash())
    //Middleware
      app.use((req,res,next)=>{
        res.locals.sucess_msg = req.flash("sucess_msg")
        res.locals.erro_msg= req.flash("erro_msg")
        next()
      })
    //bodyParser
      app.use(bodyParser.urlencoded({extended:true}));
      app.use(bodyParser.json());
    //handlebars
      app.engine('handlebars',handlebars({defaultLayout:'main'}));
      app.set('view engine','handlebars');
    //mongoose
      mongoose.Promise = global.Promise;
      mongoose.connect("mongodb://localhost/blogapp",{useNewUrlParser:true, useUnifiedTopology: true}).then(()=>{
        
        console.log("conectado ao mongo!")
      }).catch((err)=>{
        console.log("ERRO AO SE CONECTAR:"+err)
      })
  //ROTAS
    app.use('/admin',admin)

    app.get('/',(req,res)=>{
      Postagem.find().populate("categoria").sort({data:"desc"})
      .then((postagens)=>{
        res.render("index",{postagens:postagens})
      })
      .catch((err)=>{
        req.flash("erro_msg","Houve um erro interno")
        res.redirect("/404")
      })
    })
  
    app.get("/404",(req,res)=>{
      res.send("erro 404!")
    })

    app.get("/postagem/:slug",(req,res)=>{
      Postagem.findOne({slug:req.params.slug})
      .then((postagens)=>{
        if(postagens){
          res.render("postagem/index",{postagens:postagens})
        }else{
          req.flash("erro_msg","Postagem inexistnte")
          res.redirect("/")
        }
      }).catch((err)=>{
          req.flash("erro_msg","Erro interno")
          res.redirect("/")
      })
    })
  //OUTROS
  const PORT= 8081;
  app.listen(PORT,()=>{
    console.log('SERVIDOR LIGADO!');
  })
