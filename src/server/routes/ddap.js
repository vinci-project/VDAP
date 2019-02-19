const express = require('express');
const axios = require('axios');

const asyncHandler = require('../lib/asyncHandler');
const { createClient, bindClient, unbindClient } = require('../lib/clientMiddleware');
const { Change } = require('../lib/vdap');

const router = express.Router();

router.get(
  '/nodes',
  asyncHandler(async (req, res, next) => {
    const { data } = await axios.get('http://localhost:8545/nodes');
    res.send(data).end();
  })
);

// Test Bind
router.post(
  '/bind',
  createClient,
  bindClient,
  asyncHandler(async (req, res, next) => {
    res.status(200).end();
  }),
  unbindClient
);

// Create
router.post(
  '/create',
  createClient,
  bindClient,
  asyncHandler(async (req, res, next) => {
    if (!req.body.entry) {
      res.status(401).end();
      return;
    }

    if (!req.body.entry.objectclass) {
      req.body.entry.objectclass = ['CDAP'];
    }

    await req.client.add(req.body.dn, req.body.entry);
    res.status(200).end();
    next();
  }),
  unbindClient
);

// Update
router.post(
  '/update',
  createClient,
  bindClient,
  asyncHandler(async (req, res, next) => {
    await req.client.modify(req.body.dn, new Change(req.body.change));
    res.status(200).end();
    next();
  }),
  unbindClient
);

// Read
router.post(
  '/read',
  createClient,
  bindClient,
  asyncHandler(async (req, res, next) => {
    const result = await req.client.search(req.body.base, req.body.options);

    const data = result.entries.map((entry) => {
      const object = {};
      entry.attributes.forEach((attr) => {
        const values = attr._vals.map(val => Buffer.from(val).toString());
        object[attr.type] = values;
      });

      return {
        dn: entry.objectName,
        object
      };
    });

    res.send(data).end();
    next();
  }),
  unbindClient
);

// Delete
router.post(
  '/delete',
  createClient,
  bindClient,
  asyncHandler(async (req, res, next) => {
    await req.client.del(req.body.dn);
    res.status(200).end();
    next();
  }),
  unbindClient
);

module.exports = router;
