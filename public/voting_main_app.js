// Import the page's CSS. Webpack will know what to do with it.
//import "../stylesheets/app.css";

// Import libraries we need.

var jag=1;
console.log("jag global var is %d", jag);
if(jag) {
	console.log("jag debug");
/*
	var abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]');
*/
var abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"bytes8"}],"name":"votes","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"party_n","outputs":[{"name":"","type":"bytes8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"party","type":"bytes8"}],"name":"count","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"party","type":"bytes8"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"party","type":"bytes8"}],"name":"valid","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"party","type":"bytes8[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
	console.log("jag debug 1");
	var VotingContract = web3.eth.contract(abi);
	console.log("jag debug 2");

	var jag_contractInstance = VotingContract.at('0x5e8B72d212737Ef6AB1Ae4aC637D8b2d4490e066');
}
if(!jag) {
	var Voting = contract(voting_artifacts);
}

let candidates = {"bjp": "candidate-1", "con": "candidate-2", "oth": "candidate-3"};

console.log("jag end of main function");

window.voteForCandidate = function(candidate) {
  console.log("jag voteforcandidate function");
  try {

    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
	if(jag) {
		var form = document.getElementById("test");
		console.log(form.elements["test"].value);
		let candidateName = form.elements["test"].value;
		console.log("jag 1 %s",candidateName);
		jag_contractInstance.vote.estimateGas(candidateName,{ from: web3.eth.accounts[0]}, function(error, estimate_gas) {
			console.log("jag estimated gas is " + estimate_gas);
			estimate_gas += 100;
      			jag_contractInstance.vote(candidateName, {gas: estimate_gas, from: web3.eth.accounts[0]}, function(error, result) {
				console.log("jag "+ result);
          			$("#msg").html("Vote is registered in the blockchain and the hash is" + result);
        			let div_id = candidates[candidateName];
				total_votes();
			 });
      		});
	} else {
		let candidateName = $("#candidate").val();
    		$("#candidate").val("");
		console.log("org 1 %s",candidateName);
    		Voting.deployed().then(function(contractInstance) {
			console.log("org 2");
      			contractInstance.vote(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
				console.log("org 3");
        			let div_id = candidates[candidateName];
        			return contractInstance.vote.call(candidateName).then(function(v) {
					console.log("org 4");
          				$("#" + div_id).html(v.toString());
          				$("#msg").html("");
        			});
      			});
    		});
	}
  } catch (err) {
    console.log(err);
    alert(err+"\t MetaMask not logged in");
  }
}

$( document ).ready(function() {
	console.log("jag ready");
  	if (typeof web3 !== 'undefined') {
    		console.warn("Using web3 detected from external source like Metamask")
    		// Use Mist/MetaMask's provider
    		window.web3 = new Web3(web3.currentProvider);
    		find_network();
  	} else {
    		console.warn("No web3 detected");
    		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
   	 	window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  	}
  	if(!jag) {
  		Voting.setProvider(web3.currentProvider);
  	}
  	total_votes();
});

function total_votes() {
	let candidateNames = Object.keys(candidates);
  	for (var i = 0; i < candidateNames.length; i++) {
    		let name = candidateNames[i];
    		if(jag) {
     			console.log("jag total_votes  %s", name);
      			jag_contractInstance.count.call(name, function(error, v) {
        		$("#" + candidates[name]).html(v.toString());
      		});
    		} else {
    			Voting.deployed().then(function(contractInstance) {
     			console.log("toal_votes %s", name);
      			contractInstance.count.call(name).then(function(v) {
        		$("#" + candidates[name]).html(v.toString());
      		});
    	})
      }
   }
}

function find_network() {
	web3.version.getNetwork((err, netId) => {
  	switch (netId) {
    		case "1":
      			console.log('This is mainnet');
      			break;
    		case "2":
      			console.log('This is the deprecated Morden test network.');
      			break;
    		case "3":
      			console.log('This is the ropsten test network.');
      			break;
    		default:
      			console.log('This is an unknown network.');
  		}	
	})
}
