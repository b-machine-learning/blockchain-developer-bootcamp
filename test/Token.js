const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
  let token 

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Shoopie','SHOOPS',1000000)
  })

  describe('Deployment', ()=> {
    const name = 'Shoopie';
    const symbol = 'SHOOPS';
    const decimals = 18;
    const totalSupply=tokens(1000000);

    //tests go inside here
    it("Has correct name", async () => {
    // Check that name is correct
    expect(await token.name()).to.equal(name)
    })

    it("Has correct Symbol", async ()=> {
    expect(await token.symbol()).to.equal(symbol)
    })

    it("Has correct Decimals", async ()=> { 
    expect(await token.decimals()).to.equal(decimals)
    })

    it("Has correct Supply", async ()=> {
    expect(await token.totalSupply()).to.equal(totalSupply)
    })

  })
})

