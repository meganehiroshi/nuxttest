const { Router } = require('express')

const router = Router()
const mysql = require('mysql');
const bodyParser = require('body-parser')

var con = require('../../db/mysqlConnection');

//insert 時のパラメタでreq.bodyを使用するためのモジュール
router.use(bodyParser.urlencoded({ extended: true }));
// router.post('/bs', (req, res) => res.send(req.body))　//追加

const sql_select = "select id,DATE_FORMAT(startDate,'%Y/%m/%d') startDate,DATE_FORMAT(endDate,'%Y/%m/%d') endDate,title,description,linkUrl,imgUrl from notice order by id desc"
const sql_insert = "insert into notice (startDate,endDate,title,description,linkUrl,imgUrl) values(?,?,?,?,?,?)"
const sql_insert_set = "insert into notice set ?"
const sql_delete = "delete from notice where id = ?"

/* GET users listing. */
router.get('/bs', function (req, res, next) {
  con.query(sql_select, function (err, result, fields) {
    if (err) throw err;
    res.send(result)
  });
  // res.json(noticelist)
})
//
router.post('/bs', function (req, res, next) {
  console.log(req.body)
  con.query(sql_insert_set
    ,req.body
    , function (err, result, fields) {
      if (err) throw err;
      res.send(result)
    });
})
router.delete('/bs/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  console.log('id : ' +id)
  con.query(sql_delete
    ,id
    , function (err, result, fields) {
      if (err) throw err;
      res.send(result)
    });
})

module.exports = router
