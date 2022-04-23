async function main() {
    // We get the contract to deplo
    const FethBetRouter = await ethers.getContractFactory("FethBetRouter");
    const fethBetRouter = await FethBetRouter.deploy();
  
    await fethBetRouter.deployed();
    console.log("FethBetRouter deployed to:", fethBetRouter.address);
  
    fs = require('fs');
    fs.writeFileSync('./ADDRESS.txt', fethBetRouter.address, function (err) {
      if (err) return console.log(err);
      console.log('Unable to write address to file');
    });
  
    // fs.writeFile('../ABI', marketPlace, function (err) {
    //   if (err) return console.log(err);
    //   console.log('Hello World > helloworld.txt');
    // });
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });