const express= require("express");
const request=require("request")
const bodyParser=require('body-parser');
const Blockchain=require("./blockchain");
const PubSub=require("./publushsubscribe")

const app=express();
const blockchain=new Blockchain()
const pubsub=new PubSub({blockchain })

const DEFAULT_PORT=3000;
const ROOT_NODE_ADDRESS=`http://localhost:${DEFAULT_PORT}`;

setTimeout(()=>{
    pubsub.broadcastChain()
},1000)

app.use(bodyParser.json());

app.get('/api/blocks',async(req,res)=>{
    res.json(blockchain.chain)
})

app.post("/api/write",async(req,res)=>{
    const {data}=req.body;

    blockchain.addBlock({data});
    pubsub.broadcastChain();
    res.redirect('/api/blocks')
})

const synChains=()=>{
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(error,response,body)=>{
        if(!error && response.statusCode===200){
            const rootChain=JSON.parse(body);
            console.log("Replace chain on sync with ",rootChain);
            blockchain.replaceChain(rootChain)
        }
    })
}

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT==='true'){
    PEER_PORT=DEFAULT_PORT + Math.ceil(Math.random()*1000);
    console.log(PEER_PORT);
}


const PORT=PEER_PORT || DEFAULT_PORT;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    synChains();
})