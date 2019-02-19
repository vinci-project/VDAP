const express = require('express');
const axios = require('axios');

const Excel = require('exceljs');
// const PdfPrinter = require('pdfmake');
// const printer = new PdfPrinter({ timesRoman: { normal: 'Times-Roman' } });

const router = express.Router();

const verbose = (type, description) => {
  if (type === 'delete') {
    return `Deleted DN ${description.dn}`;
  }

  if (type === 'create') {
    return `Created DN ${description.dn} with data ${JSON.stringify(description.body)}`;
  }

  if (type === 'update') {
    let string = `Update DN ${description.dn}. `;
    const data = description.change.modification;
    const key = Object.keys(data)[0];
    if (description.change.operation == 'replace') {
      string += ` Changed data key "${key}" to "${data[key]}"`;
    }

    if (description.change.operation == 'delete') {
      string += ` Deleted data key "${key}"`;
    }

    if (description.change.operation == 'delete') {
      string += ` Added data key "${key}" with value "${data[key]}"`;
    }

    return string;
  }

  return 'No Description';
};

const fetchData = async (req, res, next) => {
  const { data } = await axios.get('http://localhost:8545/reports', {
    params: req.query
  });

  console.log(data);

  req.reports = data.reports;
  req.total = data.total;
  next();
};

router.get('/', fetchData, (req, res, next) => {
  if (req.query.verbose) {
    req.reports.forEach((row) => {
      row.description = verbose(row.type, row.data);
    });
  }

  res.send({
    total: req.total,
    rows: req.reports
  });
});

router.get('/html', fetchData, (req, res, next) => {
  res.send(
    `<html>
    <body>
    <pre>
    <code>${JSON.stringify(req.reports, null, 4)}</code>
    </pre>
    </body>
    </html>`
  );
});

// router.get('/pdf', fetchData, (req, res, next) => {
//   const tableBody = [
//     [
//       { text: 'ID', style: 'tableHeader' },
//       { text: 'Type', style: 'tableHeader' },
//       { text: 'User', style: 'tableHeader' },
//       { text: 'Date', style: 'tableHeader' },
//       { text: 'Description', style: 'tableHeader' }
//     ]
//   ];
//   req.reports.forEach((row) => {
//     const {
//       id, type, createdAt, user, data
//     } = row;
//     const date = new Date(createdAt);
//     const description = verbose(type, data);

//     tableBody.push([id, type, user, date, description]);
//   });

//   const docDefinition = {
//     content: [
//       {
//         layout: 'lightHorizontalLines',
//         table: {
//           headerRows: 1,
//           widths: ['*', 'auto', '*', '*', 100],
//           body: tableBody
//         }
//       }
//     ]
//   };

//   const pdfDoc = printer.createPdfKitDocument(docDefinition);
//   res.set('Content-disposition', `attachment; filename=CDAP User Report-${Date.now()}.pdf`);
//   res.set('Content-Type', 'application/pdf');
//   pdfDoc.pipe(res);
//   pdfDoc.end();
// });

router.get('/xlsx', fetchData, (req, res, next) => {
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet('Report');
  sheet.columns = [
    { header: 'Id', key: 'id', width: 30 },
    { header: 'Type', key: 'type', width: 20 },
    {
      header: 'Date',
      key: 'date',
      width: 30
    },
    {
      header: 'User',
      key: 'user',
      width: 20,
      outlineLevel: 1
    },
    { header: 'Description', key: 'description', width: 70 }
  ];

  req.reports.forEach((row) => {
    const {
      id, type, createdAt, user, data
    } = row;
    const date = new Date(createdAt);
    const description = verbose(type, data);

    sheet.addRow({
      id,
      type,
      user,
      date,
      description
    });
  });

  res.set('Content-disposition', `attachment; filename=CDAP User Report-${Date.now()}.xlsx`);
  res.set('Content-Type', 'application/vnd.ms-excel');

  workbook.xlsx.write(res);
});

module.exports = router;
