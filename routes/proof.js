const { ethers } = require('ethers');
var express = require('express');
const { default: MerkleTree } = require('merkletreejs');
var router = express.Router();

router.post('/', function(req, res, next) {
  const data = req.body;
  if (!Array.isArray(data.addrs)) {
    res.send({
      error: 'invalid params'
    });
  }
  const leaves = data.addrs
      .map((addr) => ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address'], [ethers.utils.getAddress(addr)])));
  const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sortPairs: true });
  const proofs = leaves.map((leave) => tree.getHexProof(leave));

  res.send({
    root: tree.getHexRoot(),
    proof: proofs
  });
});

module.exports = router;
