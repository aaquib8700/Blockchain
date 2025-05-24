const Blockchain=require("./blockchain");
const blockchain=new Blockchain()

blockchain.addBlock({data:"new data"});
console.log(blockchain.chain[blockchain.chain.length-1]);
let prevTimestamp,nextTimestamp,nextblock,timeDiff,averageTime;

const time=[];

for(let i=0;i<1000;i++){
    prevTimestamp=blockchain.chain[blockchain.chain.length-1].timestamp;
    blockchain.addBlock({data:`block ${i}`});
    nextblock=blockchain.chain[blockchain.chain.length-1];
    nextTimestamp=nextblock.timestamp;

    timeDiff=nextTimestamp-prevTimestamp;
    time.push(timeDiff)

    averageTime=time.reduce((total,num)=>(total+num))/time.length;

    // console.log(`time to mine block:${timeDiff}ms,Difficulty:${nextblock.difficulty},Average time:${averageTime}ms`);

}