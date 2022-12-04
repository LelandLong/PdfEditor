const { PDFDocument, StandardFonts, rgb, degrees, PageSizes } = PDFLib;
var globalPdfDoc;

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_create = () => {
  // - - - - -

  async function createPdf() {
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const page = pdfDoc.addPage();
      page.drawText("Creating PDFs in JavaScript is awesome!", {
        x: 50,
        y: 700,
        size: 30,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      console.log("createPdf function successfully saved as Base64 encoded");
      return pdfDataUri;
      //
    } catch (error) {
      console.log("createPdf try failed, catch: ", error);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "createPdf try failed, catch: " + error,
        5
      );
    }
  }

  // - - - - -

  createPdf()
    .then((returnedDoc) => {
      console.log("createPdf function successfully completed");
      globalPdfDoc = returnedDoc;
      FileMaker.PerformScriptWithOption(
        "1.15_Create-Add_results",
        returnedDoc,
        5
      );
    })
    .catch((err) => {
      console.log("createPdf ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "createPdf ERROR, err: " + err,
        5
      );
    });
};

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_getSize = () => {
  // - - - - -

  async function getSize(theDoc) {
    try {
      const pdfDoc = await PDFDocument.load(theDoc);
      const totalPages = pdfDoc.getPageCount();
      const pages = pdfDoc.getPages();
      const lastPage = pages[totalPages - 1]; // The last page of the document
      const { width, height } = lastPage.getSize();
      const jsonDimensions = {
        w: width,
        h: height,
      };
      console.log("getSize successful");
      return jsonDimensions;
      //
    } catch (error) {
      console.log("getSize try failed, catch: ", error);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "getSize try failed, catch: " + error,
        5
      );
    }
  }

  // - - - - -

  const pdfDoc = globalPdfDoc;
  getSize(pdfDoc)
    .then((dimensions) => {
      console.log("getSize function successfully completed");
      FileMaker.PerformScriptWithOption(
        "1.16_GetSize_results",
        JSON.stringify(dimensions),
        5
      );
    })
    .catch((err) => {
      console.log("getSize ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "getSize ERROR, err: " + err,
        5
      );
    });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_addPage = (pageSize) => {
  // - - - - -

  async function addPage(theParams) {
    try {
      console.log("addPage, size: ", theParams.pageSize);
      const pdfDoc = await PDFDocument.load(theParams.pdfDoc);
      let whichSize = "";
      switch (theParams.pageSize) {
        case "A7":
          whichSize = PageSizes.A7;
          break;

        case "Legal":
          whichSize = PageSizes.Legal;
          break;

        default:
          whichSize = PageSizes.Letter;
          break;
      }
      const newPage = pdfDoc.addPage(whichSize);

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      console.log("addPage function successfully saved as Base64 encoded");
      return pdfDataUri;
      //
    } catch (err) {
      console.log("addPage try failed, catch: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "addPage try failed, catch: " + err,
        5
      );
    }
  }

  // - - - - -

  const jsonParameters = {
    pdfDoc: globalPdfDoc,
    pageSize: pageSize,
  };
  addPage(jsonParameters)
    .then((returnedDoc) => {
      console.log("addPage function successfully completed");
      globalPdfDoc = returnedDoc;
      FileMaker.PerformScriptWithOption(
        "1.20_Create-Add_results",
        returnedDoc,
        5
      );
    })
    .catch((err) => {
      console.log("addPage ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "addPage ERROR, err: " + err,
        5
      );
    });
};

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_addText = (theText, whereX, whereY, rotation) => {
  // - - - - -

  async function modifyPdf(theDoc, theText, whereX, whereY, rotate) {
    try {
      console.log(
        "modifyPdf, text: ",
        theText,
        ", x: ",
        whereX,
        ", y: ",
        whereY
      );
      const pdfDoc = await PDFDocument.load(theDoc);
      const totalPages = pdfDoc.getPageCount();
      const pages = pdfDoc.getPages();
      const lastPage = pages[totalPages - 1]; // The last page of the document
      // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      lastPage.drawText(theText, {
        x: whereX,
        y: whereY,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
        maxWidth: 575,
        lineHeight: 16,
        rotate: degrees(rotate),
      });

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      console.log("modifyPdf function successfully saved as Base64 encoded");
      return pdfDataUri;
      //
    } catch (error) {
      console.log("modifyPdf try failed, catch: ", error);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "modifyPdf try failed, catch: " + error,
        5
      );
    }
  }

  // - - - - -
  const pdfDoc = globalPdfDoc;
  const posX = parseInt(whereX);
  const posY = parseInt(whereY);
  const rotate = parseInt(rotation);
  modifyPdf(pdfDoc, theText, posX, posY, rotate)
    .then((returnedDoc) => {
      console.log("modifyPdf function successfully completed");
      globalPdfDoc = returnedDoc;
      FileMaker.PerformScriptWithOption(
        "1.15_Create-Add_results",
        returnedDoc,
        5
      );
    })
    .catch((err) => {
      console.log("modifyPdf ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "modifyPdf ERROR, err: " + err,
        5
      );
    });
};
