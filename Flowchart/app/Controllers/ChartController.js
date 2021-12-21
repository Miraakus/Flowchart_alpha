const url = require('url');
const mysql = require('mysql2');
const pool = mysql.createPool({
    connectionLimit: 15, //лимит подключений
    host: "mysql-ouroborusteam-9758.nodechef.com", //адрес физического развертывания бд
    port: "2533",
    user: "ncuser_15631", //имя пользователя
    password: "JjIwZEUirMcXpHgAzw7n6LmnVwDtUu", //пароль для авторизации
    database: "ouroborusteam" //имя бд
  }); //создаём пулл соединений к базе данных, как более оптимальный метод по сравнению с одиночным подключением

class ChartController {
  static teacherGet(req, res, id){
      let index = id;
      let sql_b = 'SELECT `blocks` FROM `data` WHERE `id`=(?)'; //выборка множества блоков с бд
      let sql_d = 'SELECT `description` FROM `data` WHERE `id`=(?)';
      pool.query(sql_b, [index], function(err, data) { //запрос на выборку с бд
           if(err) return console.log(err);
           let blocks_data = JSON.stringify(data); //сериализуем строку с бд
	       let blocks = blocks_data.substring(11, blocks_data.length-2); //обрезка
           pool.query(sql_d, [index], function(err, data) {
                let description = JSON.stringify(data); //сериализуем строку с бд
                let text_description = description.substring(17, description.length-3); //обрезка
                console.log(text_description);
                res.render("Editor.hbs", {
		            teacher_blocks: blocks,
                    text_description: text_description,
                    url: req.url
                });
           });
      });
   };

   static teacherPost(req, res, id){
       let index = id;
       let sql = 'UPDATE `data` SET `nodes`=(?), `links`=(?), `blocks` =(?) WHERE `id`=(?)'; //запрос обновления 1-й строки бд
       let nodes = req.body.text_nodes; 
       let links = req.body.text_links;
       let blocks = req.body.text_blocks;
       let text_description = req.body.text_description;
       pool.query(sql, [nodes,links,blocks,index], function(err, data) { 
            if(err) return console.log(err);
            res.render("Editor.hbs", { 
                teacher_nodes: nodes,  
                teacher_links: links,
                teacher_blocks: blocks,
                text_description: text_description,
                url: req.url
            });
       });
   };

   static learnerGet(req, res, id){
       let index = id;
       let sql_b = 'SELECT `blocks` FROM `data` WHERE `id`=(?)'; 
       let sql_d = 'SELECT `description` FROM `data` WHERE `id`=(?)';
       pool.query(sql_b, [index], function(err, data) {
            if(err) return console.log(err);
            let blocks_data = JSON.stringify(data); 
	        let blocks = blocks_data.substring(11, blocks_data.length-2);
            pool.query(sql_d, [index], function(err, data) {
                 let description = JSON.stringify(data); //сериализуем строку с бд
                 let text_description = description.substring(17, description.length-3); //обрезка
                 res.render("Editor_learner.hbs", {
		             teacher_blocks: blocks,
                     text_description: text_description,
                     url: req.url
                 });
            });    
       });
   };

   static learnerPost(req, res, id){
       let index = id; 
       let nodes = req.body.text_nodes; //содержимое временной памяти
       let links = req.body.text_links;
       let text_description = req.body.text_description;
       let sql_n = 'SELECT `nodes` FROM `data` WHERE `id`=(?)'; //выборка узлов эталонного решения с бд
       let sql_l = 'SELECT `links` FROM `data` WHERE `id`=(?)'; //выборка связей эталонного решения с бд
       let sql_b = 'SELECT `blocks` FROM `data` WHERE `id`=(?)'; //выборка множества блоков с бд
       //флаги результата проверки модели решения
       let checked = "", checked_nodes = "", checked_type = "", checked_content = "", checked_index = "", checked_links = "";

       //если обучаемый не задал множество узлов или связей
       if(!nodes || !links){ //то диагностика решения не уместна и передается множество блоков, как в get-запросе
	       learnerGet(index);
       }
       else{
           pool.query(sql_n, [index], function(err, data) {
                if(err) return console.log(err);
                let nodes_data = JSON.stringify(data);
                let array_data = nodes_data.substring(10, nodes_data.length-2);
                let nodes_server = JSON.parse(array_data).sort(compare);

                let nodes_client = JSON.parse(nodes).sort(compare); //парсим и сортируем строку клиента
                //объявление колекций для сохранения индексов неверно определённых узлов клиента
                let nodes_type = [], nodes_content = [], nodes_index = [];
                //если кол-тво узлов клиента не совпадает с таковым в эталонном решении бд
                if(nodes_client.length !== nodes_server.length) {
                   checked_nodes = "Wrong number of nodes!"; //устанавливаем флаг неправильной длины
                }
                //иначе, переходим к попарному сравнению
                else {
                   for(let s in nodes_client) {
                       if(nodes_client[s].text !== nodes_server[s].text){
			           //и если текст внутри фигур не совпадает
                       checked_content = "Invalid node content!"; //устанавливаем флаг неверного текста
		               nodes_content.push(nodes_client[s].pointer);
		               }
		               if(nodes_client[s].id !== nodes_server[s].id){ 
		               //если тип сравниваемых фигур не совпадает,
                          checked_type = "Invalid node type!"; //устанавливаем флаг типа
		                  nodes_type.push(nodes_client[s].pointer);
		               }
		               /*if(nodes_client[s].pointer !== nodes_server[s].pointer){
			           //и если текст внутри фигур не совпадает
                          checked_index = "Invalid node index!"; //устанавливаем флаг неверного текста
		                  nodes_index.push(nodes_client[s].pointer);
		               }*/
                   }
                }
	            pool.query(sql_l, [index], function(err, data) {
	                 if(err) return console.log(err);
	                 let links_data = JSON.stringify(data);
	                 let array_data = links_data.substring(10, links_data.length-2);
	                 let links_server = JSON.parse(array_data);
	  
	                 let links_client = JSON.parse(links);
	  
	                 if(links_client.length !== links_server.length)
		             checked_links = "Wrong number of links!";
	  
                     if(checked_nodes === "" && checked_type === "" && checked_content === ""
                                             && checked_index === "" && checked_links === "") 
                     //если все проверки пройдены
                     checked = "Correctly!!!"; //устанавливаем флам правильного ответа
        
                     pool.query(sql_b, [index], function(err, data) {
                          if(err) return console.log(err);
                          let blocks_data = JSON.stringify(data);
	                      let blocks = blocks_data.substring(11, blocks_data.length-2);
                          res.render("_Editor_learner.hbs", {
                              learner_nodes: nodes,
		                      learner_links: links,
		                      teacher_blocks: blocks,
		                      text_description: text_description,
          
                              nodes_type: nodes_type,
                              nodes_content: nodes_content,
		                      nodes_index: nodes_index,
		 
                              check_nodes: checked_nodes,
	                          check_links: checked_links,
                              check: checked,
          
                              url: req.url
                         });
	                  });
	            });
            });

         }
    };

    static Reference(req, res, id){
        let index = id;
        let sql_n = 'SELECT `nodes` FROM `data` WHERE `id`=(?)'; //выборка узлов эталонного решения с бд
        let sql_l = 'SELECT `links` FROM `data` WHERE `id`=(?)'; //выборка связей эталонного решения с бд
	    pool.query(sql_n, [index], function(err, data) { 
             if(err) return console.log(err);
             let nodes_data = JSON.stringify(data);
             let nodes = nodes_data.substring(10, nodes_data.length-2);
            
	         pool.query(sql_l, [index], function(err, data) {
	              if(err) return console.log(err);
	              let links_data = JSON.stringify(data);
	              let links = links_data.substring(10, links_data.length-2);
      
	              res.render("Reference solution.hbs", {
		              teacher_nodes: nodes,
		              teacher_links: links
                  });
	         });
       });	
    };
}

 function compare(a, b) {
        const left = a.pointer;
        const right = b.pointer;

        let comparison = 0;
        if (left > right) {
            comparison = 1;
        } 
        else if (left < right) {
            comparison = -1;
        }
        return comparison;
    }; 

module.exports = ChartController;