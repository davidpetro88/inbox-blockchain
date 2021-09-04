const assert = require('assert');
const ganache = require('ganache-cli');
// constructor
const Web3 = require('web3');
// new instance and to connect it to ganache
const web3 = new Web3(ganache.provider());

const {abi, bytecode} = require('../compile');


// set global variables
let accounts;
let inbox;
let defaultMessage = 'Hi there!';

beforeEach(async () =>  {
    // get list of all accounts
    accounts = await web3.eth.getAccounts();

    // use account to deploy contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: [defaultMessage]})
        .send({ from: accounts[0], gas: 1000000});
});

describe('Inbox', () => {

    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async() => {
        const message = await inbox.methods.getMessage().call();
        assert.strictEqual(message, defaultMessage);
    });
    it('can change the message', async() => {
        const newMessage = 'bye';
        await inbox.methods.setMessage(newMessage).send({from: accounts[0]});
        const message = await inbox.methods.getMessage().call();
        assert.strictEqual(message, newMessage);
    });
});

