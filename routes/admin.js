const express = require ("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem")
const Postagem=mongoose.model("postagens")

router.get('/',(req,res)=>{
  res.render('admin/index')
});

router.get("/posts",(req,res) => {
  res.send("xxxxxxxx")
});

router.get("/categorias",(req,res)=>{
  Categoria.find().then((categorias)=>{
    res.render("admin/categorias",{categorias: categorias})
  }).catch((err)=>{
    req.flash("erro_msg","houve um erro ao listar categorias")
    res.redirect("/admin")
  })
 
});


router.get("/categorias/add",(req,res)=>{
  res.render("admin/categoriasadd")
});


router.post("/categorias/nova",(req,res)=>{

  var erros=[]
  if (!req.body.nome || typeof req.body.nome==undefined || req.body.nome == null ) {
    erros.push({texto:"nome invalido"})
    
  }
  if (!req.body.slug || typeof req.body.slug==undefined || req.body.slug == null ) {
    erros.push({texto:"slug invalido"})
    
  }

  if (req.body.nome.length < 2) {
    erros.push({texto:"nome da categoria muito pequeno"})
  }

  if (erros.length>0){
    res.render("admin/categoriasadd",{erros:erros})
  }else{
    const novaCategoria={
      nome: req.body.nome,
      slug: req.body.slug
    }
  
    new Categoria(novaCategoria).save().then(()=>{
      req.flash("sucess_msg","Categoria criada com sucesso")
      res.redirect("/admin/categorias")
    }).catch((err)=>{
      req.flash("erro_msg","houve um erro em registrar a categoria,tente novamente")
      res.redirect("/admin")
    })
  }


});

router.get("/categorias/edit/:id",(req,res)=>{
  Categoria.findOne({_id:req.params.id}).then((categoria)=>{
    res.render("admin/editcategorias",{categoria:categoria})
  }).catch((err)=>{
    req.flash("error_msg","Esta categoria nao existe")
    res.redirect("/admin/categorias")
  })
  
})

router.post("/categorias/edit",(req,res)=>{

  Categoria.findOne({_id: req.body.id}).then((categoria)=>{
    categoria.nome = req.body.nome
    categoria.slug = req.body.slug
    

    categoria.save().then(()=>{
      req.flash("sucess_msg","categoria editada com sucesso")
      res.redirect("/admin/categorias")
    }).catch((err)=>{
      req.flash("erro_msg","Erro ao salvar a categoria")
      res.redirect("/admin/categorias")
    })



  }).catch((err)=>{
    req.flash("erro_msg","Houve um erro ao editar a categoria")
    res.redirect("/admin/categorias")
  })

})

router.post("/categorias/deletar",(req,res)=>{
  Categoria.remove({_id:req.body.id}).then(()=>{
    req.flash("sucess_msg","Categoria removida com sucesso!")
    res.redirect("/admin/categorias")
  }).catch((err)=>{
    req.flash("erro_msg","Erro ao remover categoria...")
  })
  

})

router.get("/postagens",(req,res)=>{
  
  Postagem.find().populate("categoria").sort({data:"desc"})
  .then((postagens)=>{
    res.render("admin/postagens",{postagens:postagens})
  }).catch((err)=>{
    req.flash("erro_msg","houve um erro ao listar as postagens")
    res.redirect("/admin")
  })
  
  
})

router.get("/postagens/add",(req,res)=>{
  Categoria.find().then((categorias)=>{
    res.render("admin/postagemadd",{categorias:categorias})
  }).catch((err)=>{
    req.flash("erro_msg","houve um erro ao carregar o formulario")
    res.redirect("/admin")
  })

  router.post("/postagens/nova",(req,res)=>{
    
    const novaPostagem ={
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug
    }

    new Postagem(novaPostagem).save().then(()=>{
      req.flash("sucess_msg","Postagem salva com sucesso")
      res.redirect("/admin/postagens")
    }).catch((err)=>{
      req.flash("erro_msg","Houve um erro ao salvar a postagem")
      res.redirect("/admin/postagens")
    })

  })


    /*Postagem.findOne({_id:req.params.id})
    .then((postagens)=>{
      Categoria.find().then((categorias)=>{
        res.render("admin/editpostagens",{categorias: categorias,postagens: postagens})
      }).catch((err)=>{
        req.flash("erro_msg","Houve um erro ao listar as categorias")
        res.redirect("/admin/postagens")
      })
    }).catch((err)=>{
      req.flash("erro_msg","Houve um erro ao carregar o formulario de edição")
      res.redirect("/admin/postagens")
    })*/
    
    

  
  

})

router.get("/postagens/edit/:id",(req,res)=>{
  Postagem.findOne({_id:req.params.id})
    .then((postagens)=>{
      Categoria.find().then((categorias)=>{
        res.render("admin/editpostagens",{categorias: categorias,postagens: postagens})
      }).catch((err)=>{
        req.flash("erro_msg","Houve um erro ao listar as categorias")
        res.redirect("/admin/postagens")
      })
    }).catch((err)=>{
      req.flash("erro_msg","Houve um erro ao carregar o formulario de edição")
      res.redirect("/admin/postagens")
    })
})

router.post("/postagens/edit",(req,res)=>{

  Postagem.findOne({_id:req.body.id}).then((postagens)=>{

    postagens.titulo=req.body.titulo
    postagens.slug=req.body.slug
    postagens.descricao=req.body.descricao
    postagens.conteudo=req.body.conteudo
    postagens.categoria=req.body.categoria

    postagens.save().then(()=>{
      req.flash("sucess_msg","Postagem editada com sucesso!")
      res.redirect("/admin/postagens")
    }).catch((err)=>{
      req.flash("erro_msg","Erro interno")
      res.redirect("/admin/postagens")
    })



  }).catch((err)=>{
    req.flash("erro_msg","Houve um erro ao salvar a postagem")
    res.redirect("/admin/postagens")
  })
})

//deletando com get
router.get("/postagens/deletar/:id",(req,res)=>{
  Postagem.remove({id: req.params.id}).then(()=>{
    req.flash("sucess_msg","Postagem deletada com sucesso!")
    res.redirect("/admin/postagens")
  }).catch((err)=>{
    req.flash("erro_msg","Houve um erro ao deletar a postagem!")
    res.redirect("/admin/postagens")
  })
})


module.exports = router
