const { PDFDocument, StandardFonts, rgb, degrees } = PDFLib;
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
      const firstPage = pdfDoc.getPage(0); // The first page of the document
      const { width, height } = firstPage.getSize();
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

const pdfEditor_addImage = (
  imageType,
  imageData,
  whereX,
  whereY,
  scale,
  rotation,
  opacity
) => {
  // - - - - -

  async function addImage(theParams) {
    try {
      console.log(
        "addImage, type: ",
        theParams.type,
        ", x: ",
        theParams.posX,
        ", y: ",
        theParams.posY,
        ", scale: ",
        theParams.scale,
        ", rotate: ",
        theParams.rotate,
        ", opacity: ",
        theParams.opacity
      );
      const pdfDoc = await PDFDocument.load(theParams.pdfDoc);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0]; // The first page of the document
      const ourImage =
        theParams.type == "png"
          ? await pdfDoc.embedPng(theParams.imageData)
          : await pdfDoc.embedJpg(theParams.imageData);
      const scaledImage = ourImage.scale(theParams.scale);
      firstPage.drawImage(ourImage, {
        x: theParams.posX,
        y: theParams.posY,
        width: scaledImage.width,
        height: scaledImage.height,
        rotate: degrees(theParams.rotate),
        opacity: theParams.opacity,
      });

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      console.log("addImage function successfully saved as Base64 encoded");
      return pdfDataUri;
      //
    } catch (err) {
      console.log("addImage try failed, catch: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "addImage try failed, catch: " + err,
        5
      );
    }
  }

  // - - - - -

  const jsonParameters = {
    pdfDoc: globalPdfDoc,
    type: imageType,
    imageData: imageData,
    posX: parseInt(whereX),
    posY: parseInt(whereY),
    scale: parseFloat(scale),
    rotate: parseInt(rotation),
    opacity: parseFloat(opacity),
  };
  addImage(jsonParameters)
    .then((returnedDoc) => {
      console.log("addImage function successfully completed");
      globalPdfDoc = returnedDoc;
      FileMaker.PerformScriptWithOption(
        "1.20_Create-Add_results",
        returnedDoc,
        5
      );
    })
    .catch((err) => {
      console.log("addImage ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "addImage ERROR, err: " + err,
        5
      );
    });
};
