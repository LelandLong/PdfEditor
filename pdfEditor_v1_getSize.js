const { PDFDocument, StandardFonts, rgb } = PDFLib;
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
        y: 500,
        size: 30,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      console.log("createPdf function successfully saved & sent to FMP");
      FileMaker.PerformScriptWithOption("1.11_Create_results", pdfDataUri, 5);
      return pdfDoc;
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
  const pdfDoc = globalPdfDoc;
  const firstPage = pdfDoc.getPage(0); // The first page of the document
  const { width, height } = firstPage.getSize();
  const jsonDimensions = {
    w: width,
    h: height,
  };
  console.log("getSize function successfully sent to FMP");
  FileMaker.PerformScriptWithOption(
    "1.12_GetSize_results",
    JSON.stringify(jsonDimensions),
    5
  );
};
