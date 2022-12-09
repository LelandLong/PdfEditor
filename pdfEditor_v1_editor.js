const { PDFDocument, StandardFonts, rgb, degrees, PageSizes } = PDFLib;
var globalEntireDoc;

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_create = () => {
  // - - - - -

  async function createPdf() {
    try {
      const entireDoc = await PDFDocument.create();
      entireDoc.addPage();
      const totalPages = entireDoc.getPageCount();
      const firstPage = entireDoc.getPage(0); // The first page of the document

      // Get the width and height of the first page
      const { width, height } = firstPage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = entireDocUri;
      const results = {
        pageCount: totalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("createPdf function successfully saved");
      return results;
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
    .then((results) => {
      console.log("createPdf function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
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

const pdfEditor_load = (encodedFile, whichPage) => {
  // - - - - -

  async function loadPdf(pdfFile, pageNo) {
    try {
      const whichPage = parseInt(pageNo);
      const entireDoc = await PDFDocument.load(pdfFile);
      const totalPages = entireDoc.getPageCount();
      const firstPage = entireDoc.getPage(0); // The first page of the document

      // Get the width and height of the first page
      const { width, height } = firstPage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      // create a new empty pdfDoc, then copy requested page into it
      const singleDoc = await PDFDocument.create();
      const copiedPages = await singleDoc.copyPages(entireDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      singleDoc.addPage(thePage);

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = await singleDoc.saveAsBase64({ dataUri: true });
      const results = {
        pageCount: totalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("loadPdf function successfully saved");
      return results;
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

  loadPdf(encodedFile, whichPage)
    .then((results) => {
      console.log("loadPdf function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
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

const pdfEditor_getPage = (whichPage) => {
  // - - - - -

  async function getPage(pdfDoc, pageNo) {
    try {
      const whichPage = parseInt(pageNo);
      const entireDoc = await PDFDocument.load(pdfDoc);
      const totalPages = entireDoc.getPageCount();
      const requestedPage = entireDoc.getPage(whichPage - 1); // The requested page

      // Get the width and height of the requested page
      const { width, height } = requestedPage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      // create a new empty pdfDoc, then copy requested page into it
      const singleDoc = await PDFDocument.create();
      const copiedPages = await singleDoc.copyPages(entireDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      singleDoc.addPage(thePage);

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = await singleDoc.saveAsBase64({ dataUri: true });
      const results = {
        pageCount: totalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("getPage function successfully saved");
      return results;

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

  const entireDoc = globalEntireDoc;
  getPage(entireDoc, whichPage)
    .then((results) => {
      console.log("getPage function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
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

// - - - - - - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_addPage = (params) => {
  // - - - - -

  async function addPage(theParams) {
    try {
      const pdfDoc = theParams.pdfDoc;
      const whichPage = theParams.whichPage;
      const additionalPdf = theParams.additionalPdf;
      const blankSize = theParams.blankSize;
      const pageLocation = theParams.pageLocation;
      const pageLocation_after = theParams.pageLocation_after;
      console.log(
        "addPage, size:",
        blankSize,
        ", where:",
        pageLocation,
        ", afterNo:",
        pageLocation_after
      );

      const entireDoc = await PDFDocument.load(pdfDoc);
      const totalPages = entireDoc.getPageCount();

      let insertionIndex = 0;
      switch (pageLocation) {
        case "Front":
          insertionIndex = 0;
          break;

        case "Rear":
          insertionIndex = totalPages;
          break;

        case "After pageNo":
          insertionIndex = pageLocation_after;
          break;

        default:
          insertionIndex = totalPages - 1;
          break;
      }

      if (additionalPdf) {
        const additionalDoc = await PDFDocument.load(additionalPdf);
        // make a copy of additional
        const originalArray = await entireDoc.copyPages(
          additionalDoc,
          additionalDoc.getPageIndices()
        );
        const indicesCount = originalArray.length;
        // insert every copied page to original
        for (let index = 0; index < indicesCount; index++) {
          entireDoc.insertPage(insertionIndex + index, originalArray[index]);
        }
        // for (const page of originalArray) {
        //   entireDoc.addPage(page);
        // }
        //
      } else {
        let whichSize = "";
        switch (blankSize) {
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
        entireDoc.insertPage(insertionIndex, whichSize);
      }
      const newTotalPages = entireDoc.getPageCount();

      // create a new empty pdfDoc, then copy requested page into it
      const singleDoc = await PDFDocument.create();
      const copiedPages = await singleDoc.copyPages(entireDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      singleDoc.addPage(thePage);

      // Get the width and height of the requested page
      const { width, height } = thePage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = await singleDoc.saveAsBase64({ dataUri: true });
      const results = {
        pageCount: newTotalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("addPage function successfully saved");
      return results;
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
  console.log("addPage, params: ", params);
  let theParams = JSON.parse(params);
  theParams.pdfDoc = globalEntireDoc;
  addPage(theParams)
    .then((results) => {
      console.log("addPage function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
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

const pdfEditor_addText = (params) => {
  // - - - - -

  async function modifyPdf(theParams) {
    try {
      const pdfDoc = theParams.pdfDoc;
      const whichPage = theParams.whichPage;
      const theText = theParams.theText;
      const posX = theParams.posX;
      const posY = theParams.posY;
      const rotation = theParams.rotation;
      const opacity = theParams.opacity;
      const color = theParams.color;
      const fontFamily = theParams.fontFamily;
      const fontSize = theParams.fontSize;
      const lineHeight = theParams.lineHeight;
      const maxWidth = theParams.maxWidth;
      console.log(
        "modifyPdf, whichPage: ",
        whichPage,
        ", text: ",
        theText,
        ", x: ",
        posX,
        ", y: ",
        posY,
        ", rotation: ",
        rotation,
        ", opacity: ",
        opacity,
        ", color: ",
        color,
        ", fontFamily: ",
        fontFamily,
        ", fontSize: ",
        fontSize,
        ", lineHeight: ",
        lineHeight,
        ", maxWidth: ",
        maxWidth
      );
      const entireDoc = await PDFDocument.load(pdfDoc);
      const totalPages = entireDoc.getPageCount();
      const pages = entireDoc.getPages();
      const requestedPage = pages[whichPage - 1]; // The first page of the document

      let font = "";
      switch (fontFamily) {
        case "Courier":
          font = await entireDoc.embedFont(StandardFonts.Courier);
          break;

        case "CourierBold":
          font = await entireDoc.embedFont(StandardFonts.CourierBold);
          break;

        case "CourierBoldOblique":
          font = await entireDoc.embedFont(StandardFonts.CourierBoldOblique);
          break;

        case "Helvetica":
          font = await entireDoc.embedFont(StandardFonts.Helvetica);
          break;

        case "HelveticaBold":
          font = await entireDoc.embedFont(StandardFonts.HelveticaBold);
          break;

        case "HelveticaBoldOblique":
          font = await entireDoc.embedFont(StandardFonts.HelveticaBoldOblique);
          break;

        case "HelveticaOblique":
          font = await entireDoc.embedFont(StandardFonts.HelveticaOblique);
          break;

        case "TimesRoman":
          font = await entireDoc.embedFont(StandardFonts.TimesRoman);
          break;

        case "TimesRomanBold":
          font = await entireDoc.embedFont(StandardFonts.TimesRomanBold);
          break;

        case "TimesRomanBoldItalic":
          font = await entireDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
          break;

        case "TimesRomanItalic":
          font = await entireDoc.embedFont(StandardFonts.TimesRomanItalic);
          break;

        default:
          font = await entireDoc.embedFont(StandardFonts.Helvetica);
          break;
      }

      requestedPage.drawText(theText, {
        x: posX,
        y: posY,
        size: fontSize,
        font: font,
        color: rgb(color.red, color.green, color.blue),
        maxWidth: maxWidth,
        lineHeight: lineHeight,
        rotate: degrees(rotation),
        opacity: opacity,
      });

      // create a new empty pdfDoc, then copy requested page into it
      const singleDoc = await PDFDocument.create();
      const copiedPages = await singleDoc.copyPages(entireDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      singleDoc.addPage(thePage);

      // Get the width and height of the requested page
      const { width, height } = thePage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = await singleDoc.saveAsBase64({ dataUri: true });
      const results = {
        pageCount: totalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("modifyPdf function successfully saved");
      return results;
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
  console.log("addText, params: ", params);
  let theParams = JSON.parse(params);
  theParams.pdfDoc = globalEntireDoc;
  modifyPdf(theParams)
    .then((results) => {
      console.log("addText function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
        5
      );
    })
    .catch((err) => {
      console.log("addText ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "addText ERROR, err: " + err,
        5
      );
    });
};

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_addImage = (params) => {
  // - - - - -

  async function modifyPdf(theParams) {
    try {
      const pdfDoc = theParams.pdfDoc;
      const whichPage = theParams.whichPage;
      const encodedImage = theParams.encodedImage;
      const type = theParams.type;
      const posX = theParams.posX;
      const posY = theParams.posY;
      const rotation = theParams.rotation;
      const opacity = theParams.opacity;
      const scale = theParams.scale;
      console.log(
        "modifyPdf, whichPage: ",
        whichPage,
        ", type: ",
        type,
        ", x: ",
        posX,
        ", y: ",
        posY,
        ", rotation: ",
        rotation,
        ", opacity: ",
        opacity,
        ", scale: ",
        scale
      );
      const entireDoc = await PDFDocument.load(pdfDoc);
      const totalPages = entireDoc.getPageCount();
      const pages = entireDoc.getPages();
      const requestedPage = pages[whichPage - 1]; // The first page of the document

      const ourImage =
        type == "png"
          ? await entireDoc.embedPng(encodedImage)
          : await entireDoc.embedJpg(encodedImage);
      const scaledImage = ourImage.scale(scale);

      requestedPage.drawImage(ourImage, {
        x: posX,
        y: posY,
        width: scaledImage.width,
        height: scaledImage.height,
        rotate: degrees(rotation),
        opacity: opacity,
      });

      // create a new empty pdfDoc, then copy requested page into it
      const singleDoc = await PDFDocument.create();
      const copiedPages = await singleDoc.copyPages(entireDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      singleDoc.addPage(thePage);

      // Get the width and height of the requested page
      const { width, height } = thePage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = await singleDoc.saveAsBase64({ dataUri: true });
      const results = {
        pageCount: totalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("modifyPdf function successfully saved");
      return results;
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
  console.log("addImage, params: ", params);
  let theParams = JSON.parse(params);
  theParams.pdfDoc = globalEntireDoc;
  modifyPdf(theParams)
    .then((results) => {
      console.log("addImage function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
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

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_addRectangle = (params) => {
  // - - - - -

  async function modifyPdf(theParams) {
    try {
      const pdfDoc = theParams.pdfDoc;
      const whichPage = theParams.whichPage;
      const posX = theParams.posX;
      const posY = theParams.posY;
      const rectWidth = theParams.width;
      const rectHeight = theParams.height;
      const rotation = theParams.rotation;
      const opacity = theParams.opacity;
      const borderWidth = theParams.borderWidth;
      const borderColor = theParams.borderColor;
      const borderOpacity = theParams.borderOpacity;
      console.log(
        "modifyPdf, whichPage: ",
        whichPage,
        ", x: ",
        posX,
        ", y: ",
        posY,
        ", width: ",
        rectWidth,
        ", height: ",
        rectHeight,
        ", rotation: ",
        rotation,
        ", opacity: ",
        opacity,
        ", borderWidth: ",
        borderWidth,
        ", borderColor: ",
        borderColor,
        ", borderOpacity: ",
        borderOpacity
      );
      const entireDoc = await PDFDocument.load(pdfDoc);
      const totalPages = entireDoc.getPageCount();
      const pages = entireDoc.getPages();
      const requestedPage = pages[whichPage - 1]; // The first page of the document

      requestedPage.drawRectangle({
        x: posX,
        y: posY,
        width: rectWidth,
        height: rectHeight,
        rotate: degrees(rotation),
        opacity: opacity,
        borderWidth: borderWidth,
        borderColor: rgb(borderColor.red, borderColor.green, borderColor.blue),
        borderOpacity: borderOpacity,
      });

      // create a new empty pdfDoc, then copy requested page into it
      const singleDoc = await PDFDocument.create();
      const copiedPages = await singleDoc.copyPages(entireDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      singleDoc.addPage(thePage);

      // Get the width and height of the requested page
      const { width, height } = thePage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = await singleDoc.saveAsBase64({ dataUri: true });
      const results = {
        pageCount: totalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("modifyPdf function successfully saved");
      return results;
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
  console.log("addRectangle, params: ", params);
  let theParams = JSON.parse(params);
  theParams.pdfDoc = globalEntireDoc;
  modifyPdf(theParams)
    .then((results) => {
      console.log("addRectangle function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
        5
      );
    })
    .catch((err) => {
      console.log("addRectangle ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "addRectangle ERROR, err: " + err,
        5
      );
    });
};

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_addEllipse = (params) => {
  // - - - - -

  async function modifyPdf(theParams) {
    try {
      const pdfDoc = theParams.pdfDoc;
      const whichPage = theParams.whichPage;
      const posX = theParams.posX;
      const posY = theParams.posY;
      const xScale = theParams.xScale;
      const yScale = theParams.yScale;
      const rotation = theParams.rotation;
      const opacity = theParams.opacity;
      const borderWidth = theParams.borderWidth;
      const borderColor = theParams.borderColor;
      const borderOpacity = theParams.borderOpacity;
      console.log(
        "modifyPdf, whichPage: ",
        whichPage,
        ", x: ",
        posX,
        ", y: ",
        posY,
        ", xScale: ",
        xScale,
        ", yScale: ",
        yScale,
        ", rotation: ",
        rotation,
        ", opacity: ",
        opacity,
        ", borderWidth: ",
        borderWidth,
        ", borderColor: ",
        borderColor,
        ", borderOpacity: ",
        borderOpacity
      );
      const entireDoc = await PDFDocument.load(pdfDoc);
      const totalPages = entireDoc.getPageCount();
      const pages = entireDoc.getPages();
      const requestedPage = pages[whichPage - 1]; // The first page of the document

      requestedPage.drawEllipse({
        x: posX,
        y: posY,
        xScale: xScale,
        yScale: yScale,
        rotate: degrees(rotation),
        opacity: opacity,
        borderWidth: borderWidth,
        borderColor: rgb(borderColor.red, borderColor.green, borderColor.blue),
        borderOpacity: borderOpacity,
      });

      // create a new empty pdfDoc, then copy requested page into it
      const singleDoc = await PDFDocument.create();
      const copiedPages = await singleDoc.copyPages(entireDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      singleDoc.addPage(thePage);

      // Get the width and height of the requested page
      const { width, height } = thePage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = await singleDoc.saveAsBase64({ dataUri: true });
      const results = {
        pageCount: totalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("modifyPdf function successfully saved");
      return results;
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
  console.log("addEllipse, params: ", params);
  let theParams = JSON.parse(params);
  theParams.pdfDoc = globalEntireDoc;
  modifyPdf(theParams)
    .then((results) => {
      console.log("addEllipse function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
        5
      );
    })
    .catch((err) => {
      console.log("addEllipse ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "addEllipse ERROR, err: " + err,
        5
      );
    });
};

// - - - - - - - - - - - - - - - - - - - - -

const pdfEditor_addLine = (params) => {
  // - - - - -

  async function modifyPdf(theParams) {
    try {
      const pdfDoc = theParams.pdfDoc;
      const whichPage = theParams.whichPage;
      const startX = theParams.startX;
      const startY = theParams.startY;
      const endX = theParams.endX;
      const endY = theParams.endY;
      const color = theParams.color;
      const opacity = theParams.opacity;
      const thickness = theParams.thickness;
      console.log(
        "modifyPdf, whichPage: ",
        whichPage,
        ", startX: ",
        startX,
        ", startY: ",
        startY,
        ", endX: ",
        endX,
        ", endY: ",
        endY,
        ", color: ",
        color,
        ", opacity: ",
        opacity,
        ", thickness: ",
        thickness
      );
      const entireDoc = await PDFDocument.load(pdfDoc);
      const totalPages = entireDoc.getPageCount();
      const pages = entireDoc.getPages();
      const requestedPage = pages[whichPage - 1]; // The first page of the document

      requestedPage.drawLine({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        thickness: thickness,
        color: rgb(color.red, color.green, color.blue),
        opacity: opacity,
      });

      // create a new empty pdfDoc, then copy requested page into it
      const singleDoc = await PDFDocument.create();
      const copiedPages = await singleDoc.copyPages(entireDoc, [whichPage - 1]);
      const [thePage] = copiedPages;
      singleDoc.addPage(thePage);

      // Get the width and height of the requested page
      const { width, height } = thePage.getSize();
      const dimensions = {
        w: width,
        h: height,
      };

      const entireDocUri = await entireDoc.saveAsBase64({ dataUri: true });
      const singleDocUri = await singleDoc.saveAsBase64({ dataUri: true });
      const results = {
        pageCount: totalPages,
        dimensions: dimensions,
        entirePdf: entireDocUri,
        singlePdf: singleDocUri,
      };
      console.log("modifyPdf function successfully saved");
      return results;
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
  console.log("addLine, params: ", params);
  let theParams = JSON.parse(params);
  theParams.pdfDoc = globalEntireDoc;
  modifyPdf(theParams)
    .then((results) => {
      console.log("addLine function successfully completed");
      globalEntireDoc = results.entirePdf;
      FileMaker.PerformScriptWithOption(
        "1.44_results",
        JSON.stringify(results),
        5
      );
    })
    .catch((err) => {
      console.log("addLine ERROR, err: ", err);
      FileMaker.PerformScriptWithOption(
        "FMP_Console",
        "addLine ERROR, err: " + err,
        5
      );
    });
};
