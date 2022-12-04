const { PDFDocument, StandardFonts, rgb } = PDFLib;

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
      return await pdfDoc.saveAsBase64({ dataUri: true });
    } catch (error) {
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "createPdf try failed, catch: " + error,
        5
      );
    }
  }

  // - - - - -

  createPdf().then((pdfDataUri) => {
    FileMaker.PerformScriptWithOption("1.6_JS_results", pdfDataUri, 5);
  });
};
