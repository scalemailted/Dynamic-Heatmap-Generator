
const CanvasView = (maxFrame) => (`
    <div>
        <div class="d-flex justify-content-center mb-3">
            <canvas id="heatmapCanvas" style="border: 1px solid;"></canvas>
        </div>
        <div class="d-flex justify-content-center">
            <input type="range" id="timeSlider" class="form-range" min="0" max="${maxFrame}" value="0">
        </div>
        <div class="d-flex justify-content-center my-2">
            <button id="playPause" class="btn btn-primary ms-2 mx-2">Play</button>
            <input type="number" id="timestepInput" class="form-control" min="0" max="${maxFrame}" value="0" style="width: 80px;">
            <button id="download" class="btn btn-danger mx-2">Save</button>
        </div>
    </div>
`)

const DescriptionView = (text) => (`
    <div>
        <h4>Description:</h4>
        <blockquote class="blockquote border">
            <p class="p-2 text-justify fs-6">
                <small>${text}</small>
            </p>
        </blockquote>
    </div>
`)


/*
const CanvasView = (maxFrame) => (`
    <div>
        <div class="d-flex justify-content-center mb-3">
            <canvas id="heatmapCanvas" style="border: 1px solid;"></canvas>
        </div>
        <div class="d-flex justify-content-center">
            <input type="range" id="timeSlider" class="form-range" min="0" max="${maxFrame}" value="0">
        </div>
        <div class="d-flex justify-content-between align-items-center my-2">
            <div class="d-flex">
                <input type="number" id="timestepInput" class="form-control" min="0" max="${maxFrame}" value="0" style="width: 80px;">
                <button id="playPause" class="btn btn-primary ms-2">Play</button>
            </div>
            <div>
                <button id="download" class="btn btn-danger">Download</button>
            </div>
        </div>
    </div>
`)
*/

