/**
 * front end / renderer
 */





/******************************************************************************
 * 
 * run once document has loaded
 * 
 *****************************************************************************/
document.addEventListener('DOMContentLoaded', function () {

}, false);





/******************************************************************************
 * 
 * p5 Sketch
 *
 * main components for creating the p5 sketch 
 *****************************************************************************/

let img;


/******************************************************************************
 * 
 * Preload assessts prior to running setup function
 * 
 *****************************************************************************/
function preload() {

    img = loadImage('../images/nordwood-themes-FnOoRU-PYio-unsplash.jpg');



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
    let canvas = createCanvas(winWidth, winHeight);
    canvas.parent("p5-canvas")
    img.resize(300, 300);
    img.loadPixels();

}

/******************************************************************************
 * 
 * draw canvas
 * 
 *****************************************************************************/

function draw() {
    background(255)

    // let c1 = tinycolor({r: 255, g: 150, b:200})

    // console.log(c1.toHsv())

    // fill(c1);
    // ellipse(width/2, height/2, 100, 100);

   

    // display original image
    image(img, 0, 0)

    // adjust brightness based on mouseX position
    let brightnessAdj = map(mouseX, 0, width, -.5, .5); 

    // loop through each pixel in image and adjust brightness
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            // get color values using pixels array
            // let index = (x + y * img.width) * 4; // index

            // let r = img.pixels[index + 0];
            // let g = img.pixels[index + 1];
            // let b = img.pixels[index + 2];
            // colorMode(RGB, 255, 255, 255)
            // let originalColor = color(r, g, b);

            // get color values using get()
        //     colorMode(RGB, 255, 255, 255)
        //     let originalColor = color(img.get(x, y));
        //     let hueValue = hue(originalColor);
        //     let satValue = saturation(originalColor);
        //     let briValue = constrain(brightness(originalColor) + brightnessAdj, 0, 100);

        //     // display new image using points
        //     colorMode(HSB, 360, 100, 100)
        //     stroke(hueValue, satValue, briValue);
        //     point(x + 300, y);

                let index = (x + y * img.width) * 4; // index
                let rv = img.pixels[index + 0];
                let gv = img.pixels[index + 1];
                let bv = img.pixels[index + 2];
                let originalColor = tinycolor({r: rv, g: gv, b:bv})
                let clrHSB = originalColor.toHsv();
                let hv = clrHSB.h;
                let sv = clrHSB.s;
                let vv = constrain(clrHSB.v + brightnessAdj, 0, 1);

                let modifiedColor = tinycolor({h: hv, s: sv, v: vv}).toRgb();
                
                stroke(modifiedColor.r, modifiedColor.g, modifiedColor.b)
                strokeWeight(1.5)
                point(x + 300, y)



        }
    } 
}
function getColor(x, y) {
    push()
    colorMode(HSL, 1)
    colorMode(RGB, 255)
    let hueColor = color(img.get(x, y))
    colorMode(HSB, 1)
    let c = color(hue(hueColor), saturation(50), brightness(60))
    pop()
    return c
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h, s, v];
}


/******************************************************************************
 * 
 * key pressed
 * 
 *****************************************************************************/
function keyPressed() {


}

