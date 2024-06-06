const APP_ID = 'final-project-ziedmlr';
const ATLAS_SERVICE = 'mongodb-atlas';
const app = new Realm.App({id: APP_ID});

let user_id = null;
let mongodb = null;
let coll = null;

// fetch(`https://random-d.uk/api/random`)
// .then((response) => {
//     response.json().then((data) => {
//         console.log(data)
//     });
//   })

function getUser() {
    return document.getElementById("username").value;
   }
   function getPass() {
    return document.getElementById("password").value;
   }   

// Function executed by the LOGIN button.
const login = async () => {
    const credentials = Realm.Credentials.emailPassword(getUser(), getPass());
    console.log(credentials);
    try {
      const user = await app.logIn(credentials);
   
   
      user_id = user.id;
      mongodb = app.currentUser.mongoClient(ATLAS_SERVICE);
      coll = mongodb.db("pawpals").collection("animals");
      
      //Getting rid of the login once logged in, and getting rid of the buttons when not logged in
      
      var removelogin = document.getElementById("login-page");
 removelogin.classList.add("hidden");

      var input = document.getElementById("todoForm");
 input.classList.remove("hidden");


    } catch (err) {
      console.error("Failed to log in", err);
    }
   };
   

// Function executed by the INSERT button.
const insert_todo = async () => {
    console.log("INSERT");
    const animal = $('#animal').val();
    const name = $('#name').val();
    const d = Date.now();
    await coll.insertOne({animal, name, status: false, owner_id: user_id, d});
    find_todos();
}

const toggle_todo = async () => {
    console.log("TOGGLE");
    const task = $('#animal').val();
    const todo = await coll.findOne({task, owner_id: user_id});
    await coll.updateOne({"_id": todo._id, owner_id: user_id}, {"$set": {"status": !todo.status}});
    find_todos();
}

const delete_todo = async (parentid) => {
    console.log(parentid);
    const numId = parseInt(parentid);
    //var delete = 
    // const animal = $('#animal').val();
    // const name = $('#name').val();
    await coll.deleteOne({d: numId, owner_id: user_id});
// const specific_id = 
    // await coll.deleteOne({animal, name, owner_id: user_id});
    find_todos();
    // console.log(this)
}

// Function executed by the "FIND" button.
const find_todos = async () => {
    if (mongodb == null || coll == null) {
        $("#userid").empty().append("Need to login first.");
        console.error("Need to log in first", err);
        return;
    }

    // Retrieve todos
    const todos = await coll.find({}, {
        "projection": {
            "_id": 1,
            "animal": 1,
            "name": 1,
            "status": 1,
            "d": 1
        }
    });

    console.log(todos);

    // Access the todos div and clear it.
    let todos_div = $("#todos");
    todos_div.empty();

    // Loop through the todos and display them in the todos div.
    for (const todo of todos) {
        let p = document.createElement("p");
        p.innerHTML = `<button type="submit" onclick="delete_todo(this.parentNode.id)">Delete</button>`;
        p.setAttribute("id", todo.d)
        p.append(" Animal: ");
        p.append(todo.animal);
        p.append(" Name: ");
        p.append(todo.name);
        todos_div.append(p);
    }
};