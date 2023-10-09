/**
 * front end / renderer
 */

// navigation elements
const homeButton = document.querySelector('.nav-home');
const settingsButton = document.querySelector('.nav-settings');
const aboutButton = document.querySelector('.nav-about');
const minimizeButton = document.querySelector('.nav-min');
const closeButton = document.querySelector('.nav-close');

// ui elements
const saveFrameButton = document.querySelector('.save-frame-icon');
const loadArtworkButton = document.querySelector('.artwork-upload-icon');
const loadInteriorButton = document.querySelector('.interior-upload-icon');
const wrapCanvasButton = document.querySelector('.wrap-canvas-icon');
const wrapMinimizeIcon = document.querySelector('.feather-minimize');
const wrapMaximizeIcon = document.querySelector('.feather-maximize');
const uiDescription = document.querySelector('.ui-text');

const interiorPreviousIcon = document.querySelector('.feather-chevron-left')
const interiorNextIcon = document.querySelector('.feather-chevron-right')



/******************************************************************************
 * 
 * run once document has loaded
 * 
 *****************************************************************************/
document.addEventListener('DOMContentLoaded', function () {
    // homeButton.style.backgroundColor = "var(--color-dark-alt)";
    // homeButton.childNodes[1].style.backgroundColor = "var(--color-dark-alt)";
    // homeButton.childNodes[1].style.stroke = "var(--color-dark)";
    homeButton.style.backgroundColor = "var(--color-alt)";
    homeButton.childNodes[1].style.backgroundColor = "var(--color-alt)";
    homeButton.childNodes[1].style.stroke = "var(--color-cream)";
}, false);

/**
 * mouse over effect
 */
// homeButton.addEventListener('mouseover', function() {
//     homeButton.childNodes[1].style.stroke = "var(--color-highlight)";
// })

/**
 * mouse out effect
 */
// homeButton.addEventListener('mouseout', function() {
//     homeButton.childNodes[1].style.stroke = "var(--color-dark)";
// })


/******************************************************************************
 * 
 * left click: minimize button in nav bar
 * 
 * minimize the window
 *****************************************************************************/
minimizeButton.addEventListener('click', function () {
    window.api.minimizeWindow();
});

/******************************************************************************
 * 
 * left click: x button in nav bar
 * 
 * close the window w
 *****************************************************************************/
closeButton.addEventListener('click', function () {
    window.api.closeWindow();
});


/******************************************************************************
 * 
 * mouse over: ui elements
 * 
 * highlight icons and update ui text user feedback
 *****************************************************************************/
loadArtworkButton.addEventListener('mouseover', function () {
    uiDescription.innerHTML = "load custom artwork image"
});
loadInteriorButton.addEventListener('mouseover', function () {
    uiDescription.innerHTML = "load custom interior image"
});
wrapCanvasButton.addEventListener('mouseover', function () {
    if (wrapMinimizeIcon.classList.contains('hide')) {
        uiDescription.innerHTML = "artwork wraps around canvas edges"
    } else {
        uiDescription.innerHTML = "artwork only covers the front canvas"
    }
});
saveFrameButton.addEventListener('mouseover', function () {
    uiDescription.innerHTML = "save scene as png"
});

/******************************************************************************
 * 
 * left click: interior previous
 * 
 * load the previous interior image
 *****************************************************************************/
interiorPreviousIcon.addEventListener('click', () => {
    interiorImageIndex--;
    if (interiorImageIndex < 0) {
        interiorImageIndex = interiorImages.length - 1;
    }
    calcInteriorDimensions();

});

/******************************************************************************
 * 
 * left click: interior next
 * 
 * load the next interior image
 *****************************************************************************/
interiorNextIcon.addEventListener('click', () => {
    interiorImageIndex++;
    if (interiorImageIndex >= interiorImages.length) {
        interiorImageIndex = 0;
    }
    calcInteriorDimensions();
});

/******************************************************************************
 * 
 * left click: save frame button
 * 
 * save the current frame from p5 canvas to user desired location
 *****************************************************************************/
saveFrameButton.addEventListener('click', () => {
    let curYear = year().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let curmonth = month().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let curday = day().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let curhour = hour().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let curminute = minute().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let cursecond = second().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let defaultSaveName = "art-placer-" + curYear + curmonth + curday + curhour + curminute + cursecond;
    saveCanvas(defaultSaveName, 'png');

});

/******************************************************************************
 * 
 * left click: wrap button
 * 
 * toggle wrap and no wrap on art on canvas
 *****************************************************************************/
wrapCanvasButton.addEventListener('click', () => {
    if (wrapMinimizeIcon.classList.contains('hide')) {
        wrapMinimizeIcon.classList.remove('hide');
        wrapMaximizeIcon.classList.add('hide');
    } else {
        wrapMinimizeIcon.classList.add('hide');
        wrapMaximizeIcon.classList.remove('hide');
    }

    canvasart.wrap = !canvasart.wrap;
    canvasart.setCanvasCoreElements();
});


/******************************************************************************
 * 
 * left click: interior button
 * 
 * open file dialog to select custom interior image
 *****************************************************************************/
loadInteriorButton.addEventListener('click', () => {
    // window.api.openDialog();
    loadInteriorImage();
});
/**
 * load new interior window into canvas
 */
const loadInteriorImage = async () => {
    const filePath = await window.api.openFile();
    // interiorImage = loadImage(filePath);
    let selectedImage;
    loadImage(filePath, selectedImage => {
        // interiorImage = selectedImage;
        // let scaleFactor = 1;
        // if (interiorImage.height > 800 || interiorImage.width > 1200) {
        //     scaleFactor = 800 / interiorImage.height;
        // }
        // resizeCanvas(int(interiorImage.width * scaleFactor), int(interiorImage.height * scaleFactor))
        // interiorImage.resize(width, height);
        // document.querySelector('.p5-wrapper').style.gridTemplateColumns = "1fr 50px " + width + "px 50px 1fr";
        interiorImages.push(selectedImage);
        interiorImageIndex = interiorImages.length - 1;
        calcInteriorDimensions();
    });
}



/******************************************************************************
 * 
 * left click: art button
 * 
 * open file dialog to select custom artwork image
 *****************************************************************************/
loadArtworkButton.addEventListener('click', () => {
    loadArtworkImage();
});
/**
 * load new artwork into scene
 */
const loadArtworkImage = async () => {
    const filePath = await window.api.openFile()

    loadImage(filePath, selectedImage => {
        artworkImageOrg = selectedImage;
        let dimdif = float(artworkImageOrg.width) / artworkImageOrg.height;
        let tempw = int(300 * dimdif);
        let temph = 300;
        canvasart.w = tempw;
        canvasart.h = temph;
        canvasart.setCanvasCoreElements();
    });
}

/**
 * quick function to check if file extension is of desired image type
 * #need to work into load art and interior image to avoid errors
 * @param {*} file 
 * @returns 
 */
function isFileImage(file) {
    let isImage = false;
    let fileExtnsion = file.substr(file.lastIndexOf('.'))
    const acceptedImageTypes = ['.png', '.jpg', 'jpeg'];

    for (let i = 0; i < acceptedImageTypes.length; i++) {
        if (acceptedImageTypes.includes(acceptedImageTypes[i])) {
            isImage = true;
        }
    }
    return isImage;
}

/******************************************************************************
 * 
 * mouse out: ui elements
 * 
 * remove icon highlight and clear ui text user feedback
 *****************************************************************************/
loadArtworkButton.addEventListener('mouseout', function () {
    uiDescription.innerHTML = ""
});
loadInteriorButton.addEventListener('mouseout', function () {
    uiDescription.innerHTML = ""
});
wrapCanvasButton.addEventListener('mouseout', function () {
    uiDescription.innerHTML = ""
});
saveFrameButton.addEventListener('mouseout', function () {
    uiDescription.innerHTML = ""
});


/******************************************************************************
 * 
 * p5 Sketch
 *
 * main components for creating the p5 sketch 
 *****************************************************************************/

let interiorImage;          // the interior/background image
let artworkImageOrg;        // the orignal piece of artwork
let artworkImage;           // copy of artwork being manipulated by user

let interiorImages = [];
let interiorImageIndex = 0;


let artcanvas;              // the canvas object holding a piece of artwork

// testing elements
let angleTracker = 0;


/******************************************************************************
 * 
 * Preload assessts prior to running setup function
 * 
 *****************************************************************************/
function preload() {
    fontMontserrat = loadFont('../../assets/Poppins-Thin.ttf');
    interiorImage = loadImage('../images/interiors/mk-s-OnKP7oGZbaY-unsplash-15x10.jpg');
    artworkImage = loadImage('../images/line_stroke-000882.png');
    artworkImageOrg = loadImage('../images/line_stroke-000882.png');
    // 3:2
    interiorImages.push(loadImage('../images/interiors/christophe-rollando--rwqO6Jvo_M-unsplash-15x10.jpg'));
    interiorImages.push(loadImage('../images/interiors/mk-s-OnKP7oGZbaY-unsplash-15x10.jpg'));
    // 1:1
    interiorImages.push(loadImage('../images/interiors/olena-sergienko-YGigtDFYexs-unsplash-10x10.jpg'));
    interiorImages.push(loadImage('../images/interiors/pexels-blank-space-2647714-10x10.jpg'));
    // 2:3
    interiorImages.push(loadImage('../images/interiors/henry-co-6-stO-K6JaY-unsplash-10x15.jpg'));
    interiorImages.push(loadImage('../images/interiors/alexandru-acea-Zg9R__O-8fM-unsplash-10x15.jpg'));


}

/******************************************************************************
 * 
 * set up canvas
 * 
 *****************************************************************************/
function setup() {
    // set up canvas
    let winWidth = 1200;
    let winHeight = 800;
    let canvas = createCanvas(winWidth, winHeight, WEBGL);
    canvas.parent("p5-canvas")

    //  // set up font
    // textFont(fontMontserrat);
    colorMode(HSB, 360, 100, 100, 100);
    textureMode(NORMAL);

    //resize interior image to canvas
    interiorImage.resize(winWidth, winHeight);
    interiorImages[0].resize(winWidth, winHeight)

    // create base canvas
    canvasart = new Canvas(300, 300, 20);

    background(255);
}

/******************************************************************************
 * 
 * draw canvas
 * 
 *****************************************************************************/
function draw() {

    // translate(-width/2 + 600, -height/2 , 400) // for testing placement of canvas
    background(255);

    // #TEST move camera around test how elements are fitting in the 3d scene
    switch (angleTracker) {
        case 0:
            translate(-width / 2, -height / 2, 0) // normal
            break;
        case 1:
            translate(-width / 2 + 600, -height / 2, 500)
            rotateY(radians(45));
            break;
        case 2:
            translate(-width / 2 + 600, -height / 2, 500)
            rotateY(radians(85));
            break;
        case 3:
            translate(-width / 2 + 600, -height / 2, 500)
            rotateY(radians(90));
            break;
        case 4:
            translate(-width / 2 + 600, -height / 2, 500)
            rotateY(radians(91));
            break;
        case 5:
            translate(-width / 2, -height / 2 + 400, -600)
            rotateX(radians(45));
            break;
        case 6:
            translate(-width / 2, -height / 2 + 400, -600)
            rotateX(radians(85));
            break;
        case 7:
            translate(-width / 2, -height / 2 + 400, -600)
            rotateX(radians(90));
            break;
        case 8:
            translate(-width / 2, -height / 2 + 400, -600)
            rotateX(radians(91));
            break;
    }

    // display interior/background image
    image(interiorImages[interiorImageIndex], 0, 0)

    // display canvas art project
    canvasart.display();

    // fill(0, 50, 50);
    // rect(0, 0, 300, 300);
    // noStroke();
    
    // for(let py = 0; py < artworkImage.height; py++){
    //     for(let px = 0; px < artworkImage.width; px++) {
    //         let c = color(artworkImage.get(px, py))
    //         colorMode(HSB)
            
    //         fill(hue(c), saturation(c), lightness(c))
    //         ellipse(px, py, 1, 1)

    //     }
    // }


}


/******************************************************************************
 * 
 * key pressed
 * 
 *****************************************************************************/
function keyPressed() {
    if (key == ' ') {
        angleTracker++;
        if (angleTracker > 8) angleTracker = 0;
    }


}

/**
 * calculate the desired interior dimensions when greater than canvas height
 */
function calcInteriorDimensions() {
    let scaleFactor = 1;
    if (interiorImages[interiorImageIndex].height > 800 || interiorImages[interiorImageIndex].width > 1200) {
        scaleFactor = 800 / interiorImages[interiorImageIndex].height;
    }
    let newWidth = int(interiorImages[interiorImageIndex].width * scaleFactor);
    let newHeight = int(interiorImages[interiorImageIndex].height * scaleFactor);
    resizeCanvas(newWidth, newHeight)
    interiorImages[interiorImageIndex].resize(newWidth, newHeight);
    document.querySelector('.p5-wrapper').style.gridTemplateColumns = "1fr 50px " + width + "px 50px 1fr";
}

/******************************************************************************
 * 
 * class for creating the basic canvas holding the desired artwork
 * 
 *****************************************************************************/
class Canvas {
    constructor(w, h, d) {
        this.x = width / 2 - w / 2;     // the x position of the canvas
        this.y = height / 2 - h / 2;    // the y position of the canvas
        this.w = w;                     // width of the canvas
        this.h = h;                     // height of the canvas
        this.d = d;                     // depth of the canvas
        this.canvasHue = 0;             // canvas hue value
        this.canvasSat = 0;             // canvas saturation value
        this.canvasBri = 100;           // canvas brightness value

        this.dxs;                       // tracks differnce in pmouseX and mouseX #do i need?

        this.wrap = true;               // track canvas wrap feature of artwork
        this.setCanvasCoreElements();   // set the artwork onto canvas
    }

    /**
     * display the canvas. 
     * 
     * called in anytime you want to see the canvas/artwork. most of in the draw function
     */
    display() {

        // update canvas art position when pressed and dragged
        if (this.active()) {
            if (mouseIsPressed) {
                // move art canvas position 
                if (mouseButton == LEFT) {
                    this.x = mouseX - this.w / 2;
                    this.y = mouseY - this.h / 2;
                }
                // adjust art canvas size and depth
                if (mouseButton == RIGHT) {
                    let sizeChange = pmouseX - mouseX;


                    if (keyIsDown(CONTROL)) {
                        this.d -= sizeChange
                        if (this.d < 5) {
                            this.d = 5;
                        }
                        if (this.d > 50) {
                            this.d = 50;
                        }
                        uiDescription.innerHTML = "artwork canvas depth: " + this.d;
                    } else {
                        this.w -= sizeChange;
                        this.h -= sizeChange;
                        let dimdif = float(artworkImage.width) / artworkImage.height;

                        if (this.w < 50) {
                            this.w = 50;
                            this.h = 50 * dimdif;
                        }
                        if (this.w > 600) {
                            this.w = 600;
                            this.h = 600 * dimdif;
                        }
                        uiDescription.innerHTML = "artwork dimensions: " + this.w + " x " + this.h;
                    }
                    this.setCanvasCoreElements();
                }
            } else {
                uiDescription.innerHTML = ""
            }
        }

        noStroke();
        this.mapArtworkToCanvas()

    }

    /**
    * function for setting the core elements of the canvas such as the 
    * images/textures sliced from the given dimension while accounting
    * for wrap and no wrap styles.
    * 
    * called any time the artwork image changes or is resized
    */
    setCanvasCoreElements() {
        if (this.wrap) {
            // copy parameters: source lcx, source lcy, source width, source hight, target lcx, taget, lcy, target width, target height
            artworkImage.resize(this.w + this.d * 2, this.h + this.d * 2);
            artworkImage.copy(artworkImageOrg, 0, 0, artworkImageOrg.width, artworkImageOrg.height, 0, 0, this.w + this.d * 2, this.h + this.d * 2);
            artworkImage.resize(this.w + this.d * 2, this.h + this.d * 2);
            this.frontCanvas = createImage(this.w, this.h)
            this.frontCanvas.copy(artworkImage, this.d, this.d, this.w, this.h, 0, 0, this.w, this.h);
            this.leftCanvas = createImage(this.d, this.h)
            this.leftCanvas.copy(artworkImage, 0, this.d, this.d, this.h, 0, 0, this.d, this.h);
            this.topCanvas = createImage(this.w, this.d)
            this.topCanvas.copy(artworkImage, this.d, 0, this.w, this.d, 0, 0, this.w, this.d);
            this.rightCanvas = createImage(this.d, this.h)
            this.rightCanvas.copy(artworkImage, this.w + this.d, this.d, this.d, this.h, 0, 0, this.d, this.h);
            this.bottomCanvas = createImage(this.w, this.d)
            this.bottomCanvas.copy(artworkImage, this.d, this.h + this.d, this.w, this.d, 0, 0, this.w, this.d);
        } else {
            artworkImage.resize(this.w, this.h);
            artworkImage.copy(artworkImageOrg, 0, 0, artworkImageOrg.width, artworkImageOrg.height, 0, 0, this.w, this.h);
            artworkImage.resize(this.w, this.h);
            this.frontCanvas = createImage(this.w, this.h)
            this.frontCanvas = artworkImage;

   
            // this.frontCanvas.loadPixels();
            
            // for (let i = 0; i < this.frontCanvas.height; i++) {
            //     for (let j = 0; j < this.frontCanvas.width; j++) {

            //         // let index = (j + i * this.frontCanvas.width) * 4; // index
            //         // // get color values
            //         // let r = this.frontCanvas.pixels[index];
            //         // let g = this.frontCanvas.pixels[index + 1];
            //         // let b = this.frontCanvas.pixels[index + 2];
            //         // let a = this.frontCanvas.pixels[index + 3];
            //         // // change color values
            //         // this.frontCanvas.pixels[index] = 255;
            //         // this.frontCanvas.pixels[index + 1] = 0;
            //         // this.frontCanvas.pixels[index + 2] = 0;
            //         // this.frontCanvas.pixels[index + 3] = 255;
            //     }
            // }
            // this.frontCanvas.updatePixels();
        

        }
    }

    

    /**
     * function for mapping the sliced artwork textures from setCanvasCoreElements
     * to the actual canvas itself
     * 
     */
    mapArtworkToCanvas() {
        // front canvas
        texture(this.frontCanvas);
        beginShape();
        vertex(this.x, this.y, this.d, 0, 0);
        vertex(this.x + this.w, this.y, this.d, 1, 0);
        vertex(this.x + this.w, this.y + this.h, this.d, 1, 1);
        vertex(this.x, this.y + this.h, this.d, 0, 1);
        endShape(CLOSE);
        // image(this.frontCanvas, this.x, this.y)

        // canvas background color
        fill(this.canvasHue, this.canvasSat, this.canvasBri)

        // left edge  
        if (this.wrap) {
            texture(this.leftCanvas);
        }
        beginShape();
        vertex(this.x, this.y, 0, 0, 0,);
        vertex(this.x, this.y, this.d, 1, 0);
        vertex(this.x, this.y + this.h, this.d, 1, 1);
        vertex(this.x, this.y + this.h, 0, 0, 1);
        endShape(CLOSE);
        // image(this.leftCanvas, this.x - this.d - 5, this.y)

        // top edge
        if (this.wrap) {
            texture(this.topCanvas);
        }
        beginShape();
        vertex(this.x, this.y, 0, 0, 0);
        vertex(this.x + this.w, this.y, 0, 1, 0);
        vertex(this.x + this.w, this.y, this.d, 1, 1);
        vertex(this.x, this.y, this.d, 0, 1);
        endShape(CLOSE);
        // image(this.topCanvas, this.x, this.y - this.d - 5)

        // right edge
        if (this.wrap) {
            texture(this.rightCanvas);
        }
        beginShape();
        vertex(this.x + this.w, this.y, this.d, 0, 0);
        vertex(this.x + this.w, this.y, 0, 1, 0);
        vertex(this.x + this.w, this.y + this.h, 0, 1, 1);
        vertex(this.x + this.w, this.y + this.h, this.d, 0, 1);
        endShape(CLOSE);
        // image(this.rightCanvas, this.x + this.w + 5, this.y)

        // bottom edge
        if (this.wrap) {
            texture(this.bottomCanvas);
        }
        beginShape();
        vertex(this.x, this.y + this.h, this.d, 0, 0);
        vertex(this.x + this.w, this.y + this.h, this.d, 1, 0);
        vertex(this.x + this.w, this.y + this.h, 0, 1, 1);
        vertex(this.x, this.y + this.h, 0, 0, 1);
        endShape(CLOSE);
        // image(this.bottomCanvas, this.x, this.y + this.h + 5)
    }

    /**
     * function that checks if mouse is over the artwork
     * 
     * @returns true when mouse is over the artwork
     */
    active() {
        // calculate bounds of artcanvas
        let xmin = this.x;
        let xmax = this.x + this.w
        let ymin = this.y;
        let ymax = this.y + this.h
        // check if mouse cursor is withing bounds of artcanvas
        if (mouseX > xmin && mouseX < xmax &&
            mouseY > ymin && mouseY < ymax) {
            return true;
        } else {
            return false;
        }
    }
}




