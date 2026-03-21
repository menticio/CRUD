const base_url ="http://localhost:3000";

const api ={ 

    read :function(entity){
        return fetch(`${base_url}/${entity}`) // http://localhost:3000/products.json
        .then(function(res){
            return res.json();
        });
    },

    create: function(entity, data) {
    return fetch(`${base_url}/${entity}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }) 
    .then(function(res) {
      return res.json();
    });
  },  

  update : function(entity ,id, data ){
    return fetch(`${base_url}/${entity}/${id}`,{
        method:"PUT",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(data)
    })
    .then(function(res){
        return res.json();
    });
  },

  delete : function(entity , id){
    return fetch(`${base_url}/${entity}/${id}`,{
        method:"DELETE",
    })
    .then(function(res){
        return res.json();
    });
  }
};





