const express = require('express');
const app = express();
const port = 4010;
const e = require('express');
app.use(express.json());


let tokens = [];
let list = [];


const generateRandomString = (num) =>
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.all("*", function (req, res, next) {
    res.header({
        "Access-Control-Allow-Origin": "http://localhost:8080"
        , "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        , "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Token"
    });
    next();
});

app.all('/:token/*', function (req, res, next) {
    if (tokens.includes(req.params.token))
    {
        next();
    }
    else 
    {
        next(new Error("일치하지 않는 토큰"));
    }
});

app.get('/login', (req, res) =>
{
    let token = generateRandomString(16);
    tokens.push(token);
    res.status(200);

    res.json({
        status: 0
        , errorMessage: ''
        , response: {
            token: token
        }
    });  

    console.log(tokens);
});



app.post('/:token/create', (req, res, next) =>
{
    let name = req.body.name;
    if (list.includes(name))
    {    
        next(new Error('중복된 아이디'));
    }
    else
    {
        list.push(name);
        res.status(200);
        res.json({
            status: 0
            , errorMessage: ''
            , response: ''
        });
    }
})

app.get('/:token/read', (req, res, next) =>
{
    console.log("list:", list);
    let result = [];
    let random = Math.floor(Math.random() * 2);
   
    list.forEach((value, index, _) => {
        result.push({ id: index, name: value });
    });
    res.status(200);
    res.json({
        status: random
        , errorMessage: '랜덤으로 에러'
        , response: result
    });   
})

app.post('/:token/update', (req, res, next) =>
{
    let id = req.body.id;
    let name = req.body.name;
    if (list.length <= id)
    {    
        next(new Error("존재하지 않는 키"));
    }
    else
    {
        list[id] = name;
        res.status(200);
        res.json({
            status: 0
            , errorMessage: ''
            , response: ''
        });
    }
})

app.post('/:token/delete', (req, res, next) =>
{
    let id = req.body.id;
    if (list.length - 1 < id)
    {    
        next(new Error("존재하지 않는 키"));
    }
    else
    {
        list.splice(id, 1);
        res.status(200);
        res.json({
            status: 0
            , errorMessage: ''
            , response: ''
        });
    }
})

app.listen(port, () =>
{
    console.log(`server is listening at localhost:${port}`);
});

app.use((err, req, res, next) =>
{
    console.error(err);
    res.status(500)
    .json({
        status: 1
        , errorMessage: err.message
        , response: ''
    });
})