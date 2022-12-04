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

      return await pdfDoc.save__PURPOSELY_MIS_SPELL__AsBase64({
        dataUri: true,
      });
    } catch (error) {
      //  <- double-slash = comment
      //
      //  we purposely mis-spelled the function above so that an error would occur during the TRY
      //  when an error occurs anywhere in the TRY section, it will trigger the code in the following CATCH section
      //  in our CATCH section below we run a FMP script that will simply display the error message to the user in a Custom Dialog
      //  Note: to concat strings together in FMP you use the '&' character, while in JS you use the '+' character
      //
      //  console.log is a standard function that prints the provided data to the Console
      //  the only way for us to access this Console in a FMP webviewer is to use the web inspector:
      //    (MacOS only)                https://blog.beezwax.net/how-to-enable-webkit-and-javascript-debugging-in-filemaker-web-viewers/
      //    (MacOS & Windows)    https://www.mbsplugins.eu/WebViewSetPreferences.shtml
      //

      console.log("createPdf try failed, catch: ", error);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "createPdf try failed, catch: " + error,
        5
      );
    }
  }

  // - - - - -

  createPdf().then((pdfDataUri) => {
    console.log("createPdf function successfully completed");
    FileMaker.PerformScriptWithOption("1.6_JS_results", pdfDataUri, 5);
  });
};
