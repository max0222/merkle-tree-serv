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
    return
  }
  for (let i = 0; i < data.length; i++) {
    if (!Array.isArray(data[i]) || data[i].length != 2) {
        res.send({
            error: 'invalid params'
        });
        return
    }
  }

  data.sort((a, b) => a[0].localeCompare(b[0]));
  const leaves = data.map((datum) => datum[1]);
  const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sortPairs: true });
  const proofs = []
  for (let i = 0; i < data.length; i++) {
    proofs.push({
      address: data[i][0],
      proof: JSON.stringify(tree.getHexProof(leaves[i])),
    })
  }

  res.send({
    root: tree.getHexRoot(),
    proofs: proofs
  });
});

module.exports = router;
