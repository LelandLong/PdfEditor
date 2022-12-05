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

const pdfEditor_merge = (encodedFile) => {
  // - - - - -

  async function mergePdfs(originalDoc, additionalDoc) {
    try {
      const original = await PDFDocument.load(originalDoc);
      const additional = await PDFDocument.load(additionalDoc);

      // make a copy of additional
      const originalArray = await original.copyPages(
        additional,
        additional.getPageIndices()
      );
      // add/append every copied page to original
      for (const page of originalArray) {
        original.addPage(page);
      }

      const pdfDataUri = await original.saveAsBase64({ dataUri: true });
      console.log("loadPdf function successfully saved as Base64 encoded");
      return pdfDataUri;
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
  mergePdfs(pdfDoc, encodedFile)
    .then((returnedDoc) => {
      console.log("mergePdfs function successfully completed");
      globalPdfDoc = returnedDoc;
      FileMaker.PerformScriptWithOption(
        "1.42_Load-Merge_results",
        JSON.stringify(returnedDoc),
        5
      );
    })
    .catch((err) => {
      console.log("mergePdfs ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "mergePdfs ERROR, err: " + err,
        5
      );
    });
};
