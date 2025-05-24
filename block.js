const{GENESIS_DATA, MINE_RATE}=require('./config')
const cryptohash= require("./cryptohash")
const HextoBinary=require("hex-to-binary")

class Block{
    constructor({timestamp,prevHash,hash,data,nonce,difficulty}){
        this.timestamp=timestamp;
        this.prevHash=prevHash;
        this.hash=hash;
        this.data=data;
        this.nonce=nonce;
        this.difficulty=difficulty
    }
    static genesis(){
        return new this(GENESIS_DATA);
    }
    static mineBlock({prevBlock,data}){
        let hash,timestamp;
        const prevHash=prevBlock.hash;
        let{difficulty}=prevBlock;

        let nonce=0;
        do{
            nonce++;
            timestamp=Date.now();
            difficulty=Block.adjustDifficulty({
                originalBlock:prevBlock,
                timestamp,
            })
            hash=cryptohash(timestamp,prevHash,data,nonce,difficulty)
        }while(HextoBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty))

        return new this({
            timestamp,
            prevHash,
            data,
            hash,
            nonce,
            difficulty,
        })
    }

    static adjustDifficulty({originalBlock,timestamp}){
        const{difficulty}=originalBlock;
        if(difficulty<1) return 1;

        const difference=timestamp-originalBlock.timestamp;
        if(difference>MINE_RATE) return difficulty-1;
        return difficulty+1;
    }
} 

// const block1=new Block({
//     hash:'0xacb',
//     prevHash:'0xc12',
//     data:'hello',
//     timestamp:'2/09/22',
// })

const genesisblock=Block.genesis();
// console.log(genesisblock);

// const  result= Block.mineBlock({prevBlock:block1,data:'block2'})
// console.log(result);

module.exports=Block;