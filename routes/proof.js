const { ethers } = require('ethers');
var express = require('express');
const { default: MerkleTree } = require('merkletreejs');
var router = express.Router();

router.post('/', function(req, res, next) {
  const data = req.body;
  if (!Array.isArray(data)) {
    res.send({
      error: 'invalid params'
    });
  }
  const leaves = data
      .map((addr) => ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address'], [ethers.utils.getAddress(addr)])));
  const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sortPairs: true });
  const proofs = []
  for (let i = 0; i < data.length; i++) {
    proofs.push({
      address: data[i],
      proof: JSON.stringify(tree.getHexProof(leaves[i])),
    })
  }

  res.send({
    root: tree.getHexRoot(),
    proofs: proofs
  });
});

module.exports = router;
