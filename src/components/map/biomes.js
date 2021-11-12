import React, { useEffect, useRef } from "react";
import { perlin1, perlin2 } from "../../utils/perlinNoise"
import "./biomes.css"

function BiomeCanvas() {
    
    const canvasRef = useRef(null);

    useEffect(()  => {
        const layerB = canvasRef.current
        layerB.width = layerB.clientWidth
        layerB.height = layerB.clientHeight
        const ctx = layerB.getContext('2d')
        let r, g, b;
        let t = 6;
        for (let i = 0; i < layerB.width/t; i++) {
            for (let j = 0; j < layerB.height/t; j++) {
                r = g = b = (perlin1(8, 1, 0.4, i*t, j*t)+1)*127.5
                ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")"
                ctx.fillRect(i*t, j*t, t, t);
            }
        }
    }, [])
/*


for (let i = 0; i < layerB.width/t; i++) {
            for (let j = 0; j < layerB.height/t; j++) {
                r = (perlin1(10, 1, 0.5, i, j)+1)*127.5
                tab.push(r)
                if (r < 50) { // noir
                    r = 0
                    b = 0
                    g = 0
                } else if (r < 100) { // rouge
                    r = 255
                    b = 0
                    g = 0
                } else if (r < 150) { // bleu
                    r = 0
                    b = 255
                    g = 0
                } else if (r < 200) { // vert
                    r = 0
                    b = 0
                    g = 255
                } else { // blanc
                    r = 255
                    g = 255
                    b = 255
                }
                ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")"
                ctx.fillRect(i*t, j*t, t, t);
            }
        }
*/
    return <canvas className="biomes" ref={canvasRef}/>
}

export default BiomeCanvas;