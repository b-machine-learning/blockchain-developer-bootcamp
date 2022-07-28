const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
  let token,
      accounts,
      deployer,
      receiver,
      exchange

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Shoopie','SHOOPS',1000000)

    accounts = await ethers.getSigners()
    deployer = accounts[0]
    receiver = accounts[1]
    exchange = accounts[2]
  })

  describe('Deployment', ()=> {
    const name = 'Shoopie';
    const symbol = 'SHOOPS';
    const decimals = 18;
    const totalSupply=tokens(1000000);

    //tests go inside here
    it('Has correct name', async () => {
    // Check that name is correct
    expect(await token.name()).to.equal(name)
    })

    it('Has correct Symbol', async ()=> {
    expect(await token.symbol()).to.equal(symbol)
    })

    it('Has correct Decimals', async ()=> { 
    expect(await token.decimals()).to.equal(decimals)
    })

    it('Has correct Supply', async ()=> {
    expect(await token.totalSupply()).to.equal(totalSupply)
    })

    it('Assigns total supply to the deployooor', 
      async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
    })

  })

  describe('Sending Token', () => {
    let amount, transaction, result 

    describe('Success', ()=> {

      beforeEach(async () => {
        amount=tokens(100)
        transaction = await token.connect(deployer).transfer(receiver.address, amount)
        result = await transaction.wait()
      })  

      it('Transfers token balances', async () => {
        //Ensure tokens were transfered (balance changed)
        expect(await token.balanceOf(deployer.address)).to.equal(
          tokens(999900))
        expect(await token.balanceOf(receiver.address)).to.equal(
          amount)
      })

      it('Emits a Transfer Event', async () => {
        const event_Select=result.events[0]
        //console.log(event_Select)
        expect(event_Select.event).to.equal('Transfer')
        const args = event_Select.args 
        expect(args._from).to.equal(deployer.address)
        expect(args._to).to.equal(receiver.address)
        expect(args._value).to.equal(amount)
      })
    
    })

    describe('Failure', ()=> {
      it('rejects.. insufficient balance', async () => {
        //Transfer more tokens than available
        const invalidAmount = tokens(1000000000)
        await expect(token.connect(deployer).transfer(
            receiver.address, invalidAmount)).to.be.reverted
      })

      it('rejects burning supply', async ()=> {
        const amount = tokens(10)
        await expect(
          token.connect(deployer).transfer(
            '0x0000000000000000000000000000000000000000', amount)).to.be.reverted
      })
    })

    describe('Approving Tokens', () => {
    let amount, transaction, result 

     beforeEach(async ()=> {
       amount=tokens(100)
       transaction = await token.connect(deployer).approve(exchange.address, amount)
       result = await transaction.wait()
     })

      describe('Success', ()=> {
        it('allocates an allowance for delegated token spending', async ()=>{
          expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
        })
        it('Emits a Approval Event', async () => {
          const event_Select=result.events[0]
          console.log(event_Select)
          expect(event_Select.event).to.equal('Approval')
          const args = event_Select.args 
          expect(args._owner).to.equal(deployer.address)
          expect(args._spender).to.equal(exchange.address)
          expect(args._value).to.equal(amount)
        })
      }) 
     describe('Failure', () => {
        it('rejects invalid spenders', async () => {
          await expect(
            token.connect(
              deployer).approve(
                '0x0000000000000000000000000000000000000000', amount)).to.be.reverted
        })
     })
    
    }) //Approving Tokens end

  }) //Sending Tokens end
})  //Token end

