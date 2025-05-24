const redis = require("redis");

const CHANNEL = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(CHANNEL.TEST);
    this.subscriber.subscribe(CHANNEL.BLOCKCHAIN);

    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }
  handleMessage(channel, message) {
    console.log(`Message Recieved,Channel:${channel} Message:${message}`);
    const parseMessage=JSON.parse(message)
    // console.log(parseMessage);
    if(channel===CHANNEL.BLOCKCHAIN){
        this.blockchain.replaceChain(parseMessage);
    }
  }
  publish({channel,message}){
    this.publisher.publish(channel,message);
  }
  broadcastChain(){
    this.publish({
        channel:CHANNEL.BLOCKCHAIN,
        message:JSON.stringify(this.blockchain.chain)
    })
  }
}

// const checkPubsub=new PubSub();
// setTimeout(()=>{
//     checkPubsub.publisher.publish(CHANNEL.TEST,'Hello')
// },1000)

module.exports = PubSub;
