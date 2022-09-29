const express = require('express');
const app = express();
const mongoose = require('mongoose');
const date=require(__dirname+"/date.js");
const _ = require('lodash');
//console.log(date);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))

// ------------------------------------------------------------------------------------
mongoose.connect('mongodb+srv://jayyanth:james007@cluster0.q2w0fer.mongodb.net/todolistDB');
const todolistSchema =new mongoose.Schema({
  name:String
});
const Item=mongoose.model("item",todolistSchema);
const item1=new Item({
  name:"hello my name is jayyanth sai"
});
const item2=new Item({
  name:"Iam bigFan of keanu reeves !!"
});
const item3=new Item({
  name:"my fav movie was 'forestGump' and 'catch me if you can' "
});
const defaultArray=[item1,item2,item3];
//==============================================================================================================================
app.post("/delete",function(req,res){
  const cat=req.body.apple; //  id
  const elephant=req.body.listName; //   listname
  if(elephant==="Today"){
    Item.findByIdAndRemove(cat,function(err){
    if(err){
    console.log(err);}
    else{
    console.log("No Error !!");}
    });
    res.redirect("/");
  }
  else{
    console.log(elephant);
    CustomModel.findOneAndUpdate(
      {name:elephant},
      { $pull : {items: {_id:cat}}},
      function(err,foundList){
        if(!err){
          res.redirect("/"+ elephant);
        }
      }
    )
  }
});
//==============================================================================================================================
// 1st step
const listSchema={
  name:String,
  items:[todolistSchema]
};
const CustomModel=mongoose.model("customcollection",listSchema);

//===========================================================================================================================================================================
app.get("/:customListName",function(req,res){
  const customListName= _.capitalize(req.params.customListName);
  CustomModel.findOne({name:customListName}, function(err, foundItems){
    if(!foundItems){
      // createOne
      const dog=new CustomModel({
        name:customListName,
        items:defaultArray
      });
      dog.save();
      res.redirect("/"+customListName);
    }
    else{
      res.render("list", {
        listTitle: customListName,
        newListItem:foundItems.items
      });
    }
  } )
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
//--------------------------------------------------------------------------------------------------

var items=["BuyFood","CookFood","EatFood"];
var workitems=[];
app.get("/", function(req, res) {
  let day_name=date.getDate();
  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultArray,function(err){
        if(err){
          console.log("there exists error !!");
        }
        else{
          console.log("No error !!");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list", {
        listTitle: "Today",
        newListItem:foundItems
      });
    }
  });
});
app.post("/",function(req,res){
  //console.log(req.body.list);
  const temp1=req.body.list;
  const item=req.body.newItem;
  const temp=new Item({
    name:item
  });
  if (temp1 === "Today"){
    temp.save();
    res.redirect("/");
  }
  else{
    CustomModel.findOne({name:temp1},function(err,foundList){
        foundList.items.push(temp);
        foundList.save();
        res.redirect("/"+temp1);
    });
  }
});
app.get("/work",function(req,res){
  res.render("list",{listTitle:"WorkList",newListItem:workitems});
});
app.get("/about",function(req,res){
  res.render("about")
})
app.listen(port, function() {
  console.log("server 3000 started !!");
});
