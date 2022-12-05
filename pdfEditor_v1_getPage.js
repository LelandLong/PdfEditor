const { PDFDocument, StandardFonts, rgb, degrees, PageSizes } = PDFLib;
var globalPdfDoc;

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_load = (encodedFile) => {
  // - - - - -

  async function loadPdf(pdfFile) {
    try {
      const pdfDoc = await PDFDocument.load(pdfFile);

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      console.log("loadPdf function successfully saved as Base64 encoded");
      return pdfDataUri;
      //
    } catch (error) {
      console.log("loadPdf try failed, catch: ", error);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "loadPdf try failed, catch: " + error,
        5
      );
    }
  }

  // - - - - -

  loadPdf(encodedFile)
    .then((returnedDoc) => {
      console.log("loadPdf function successfully completed");
      globalPdfDoc = returnedDoc;
      FileMaker.PerformScriptWithOption(
        "1.38_Load-Get_results",
        returnedDoc,
        5
      );
    })
    .catch((err) => {
      console.log("loadPdf ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "loadPdf ERROR, err: " + err,
        5
      );
    });
};

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_getSize = (whichPage) => {
  // - - - - -

  async function getSize(theDoc, whichPage) {
    try {
      const pdfDoc = await PDFDocument.load(theDoc);
      const totalPages = pdfDoc.getPageCount();

      // make sure we don't request a page that cannot exist
      if (whichPage > totalPages) {
        whichPage = totalPages;
      }

      const pages = pdfDoc.getPages();
      const requestedPage = pages[whichPage - 1]; // The last page of the document
      const { width, height } = requestedPage.getSize();
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
  getSize(pdfDoc, whichPage)
    .then((dimensions) => {
      console.log("getSize function successfully completed");
      FileMaker.PerformScriptWithOption(
        "1.39_GetSize_results",
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

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_getPage = (whichPage) => {
  // - - - - -

  async function getPage(theDoc, whichPage) {
    try {
      const pdfDoc = await PDFDocument.load(theDoc);
      const totalPages = pdfDoc.getPageCount();

      // make sure we don't request a page that cannot exist
      if (whichPage > totalPages) {
        whichPage = totalPages;
      }

      // create a new empty pdfDoc, then copy requested page into it
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(pdfDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      newDoc.addPage(thePage);

      const pdfDataUri = await newDoc.saveAsBase64({ dataUri: true });
      console.log("getPage function successfully saved as Base64 encoded");
      return pdfDataUri;

      //
    } catch (error) {
      console.log("getPage try failed, catch: ", error);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "getPage try failed, catch: " + error,
        5
      );
    }
  }

  // - - - - -

  const pdfDoc = globalPdfDoc;
  getPage(pdfDoc, whichPage)
    .then((returnedDoc) => {
      console.log("getPage function successfully completed");
      FileMaker.PerformScriptWithOption(
        "1.38_Load-Get_results",
        JSON.stringify(returnedDoc),
        5
      );
    })
    .catch((err) => {
      console.log("getPage ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "getPage ERROR, err: " + err,
        5
      );
    });
};

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_addText = (theParams) => {
  // - - - - -

  async function modifyPdf(theParams) {
    try {
      console.log(
        "modifyPdf, text: ",
        theParams.theText,
        ", x: ",
        theParams.posX,
        ", y: ",
        theParams.posY,
        ", rotate: ",
        theParams.rotate
      );
      const pdfDoc = await PDFDocument.load(theParams.pdfDoc);
      const totalPages = pdfDoc.getPageCount();
      const pages = pdfDoc.getPages();
      const requestedPage = pages[theParams.whichPage - 1]; // The requested page of the document
      // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      requestedPage.drawText(theParams.theText, {
        x: parseInt(theParams.posX),
        y: parseInt(theParams.posY),
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
        maxWidth: 575,
        lineHeight: 16,
        rotate: degrees(parseInt(theParams.rotate)),
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
  //
  // add the pdfDoc to the incoming params
  const convertStringParametersToObject = JSON.parse(theParams);
  convertStringParametersToObject.pdfDoc = globalPdfDoc;

  modifyPdf(convertStringParametersToObject)
    .then((returnedDoc) => {
      console.log("modifyPdf function successfully completed");
      globalPdfDoc = returnedDoc;
      FileMaker.PerformScriptWithOption(
        "1.38_Load-Get_results",
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
