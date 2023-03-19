let active_heatmap = null;
const $heatmapSelector = document.getElementById('heatmap-selector');
const $generalOptions = document.getElementById('heatmap-general-options');
const $specificOptions = document.getElementById('heatmap-specific-options');


$heatmapSelector.innerHTML = HeatmapSelection(); 
$generalOptions.innerHTML = GeneralOptionsForm(optionsListGeneral);


const $selector = document.getElementById('heatmap-type');
$selector.addEventListener('change', selectionHandler);

function selectionHandler (event){
    const $heatmap_selector = document.getElementById("heatmap-type")
    const $viewport = document.getElementById("viewport")
    const selected = $heatmap_selector.value
    const selectedText = $heatmap_selector.options[$heatmap_selector.selectedIndex].text;
    let optionsList = []

    switch(selected){
        case 'evo-spatial': optionsList = optionsListConway; break;
        case 'evo-temporal': optionsList = optionsListConway; break;
        case 'rnd-weight-none':  optionsList = optionsListRandom; break;
        case 'rnd-weight-proximity': optionsList = optionsListRandom; break;
    }
    $specificOptions.innerHTML = SpecificOptionsForm(selectedText,optionsList);
    const description = heatmap_descriptions[selected]
    $viewport.innerHTML = DescriptionView(description)

}

const $generate = document.getElementById('submit');
$generate .addEventListener('click', generateHandler);

function generateHandler (event){
    const selected = document.getElementById("heatmap-type").value;
    const length = +document.getElementById('length').value;
    const width = +document.getElementById('width').value;
    const cellsize = +document.getElementById('cellSize').value;
    const snapshots = +document.getElementById('snapshots').value;
    switch(selected){
        case 'evo-spatial': evoultionarySpatialRules(length,width,cellsize,snapshots); break;
        case 'evo-temporal': evoultionaryTemporalRules(length,width,cellsize,snapshots); break;
        case 'rnd-weight-none': randomWeightedNone(length,width,cellsize,snapshots); break;
        case 'rnd-weight-proximity': randomWeightedProximity(length,width,cellsize,snapshots); break;
    }
}

function evoultionarySpatialRules(length,width,cellSize,snapshots){
    const pAlive = +document.getElementById('pAlive').value;
    const heatmap = new HeatmapConwayGoLWithSpatialRules("heatmapCanvas", length, width, cellSize, snapshots, pAlive);
    //heatmap.run();
    heatmap.setHeatmaps();
    active_heatmap = heatmap;
    init_view();
    updateHeatmap(0);
}

function evoultionaryTemporalRules(length,width,cellSize,snapshots){
    const pAlive = +document.getElementById('pAlive').value;
    const heatmap = new HeatmapConwayGoLWithTemporalRules("heatmapCanvas", length, width, cellSize, snapshots, pAlive);
    //heatmap.run();
    heatmap.setHeatmaps();
    active_heatmap = heatmap;
    init_view();
    updateHeatmap(0);
}

function randomWeightedNone(length,width,cellSize,snapshots){
    const hot = +document.getElementById('hotThreshold').value;
    const warm = +document.getElementById('warmThreshold').value;
    const cool = +document.getElementById('coolThreshold').value;
    const hotspotDistribution = {hotThreshold: hot, warmThreshold: warm, coolThreshold: cool}
    const heatmap = new HeatmapRandomWeighted("heatmapCanvas", length, width, cellSize, snapshots, hotspotDistribution);
    //heatmap.run();
    heatmap.setHeatmaps();
    active_heatmap = heatmap;
    init_view();
    updateHeatmap(0);
}

function randomWeightedProximity(length,width,cellSize,snapshots){
    const hot = +document.getElementById('hotThreshold').value;
    const warm = +document.getElementById('warmThreshold').value;
    const cool = +document.getElementById('coolThreshold').value;
    const hotspotDistribution = {hotThreshold: hot, warmThreshold: warm, coolThreshold: cool}
    const heatmap = new HeatmapRandomWeightedWithConstraints("heatmapCanvas", length, width, cellSize, snapshots, hotspotDistribution);
    //heatmap.run();
    heatmap.setHeatmaps();
    active_heatmap = heatmap;
    init_view();
    updateHeatmap(0)
}

// ... (existing code)

// Get the slider, input, and button elements
function init_view() {
    const maxFrame = active_heatmap.getHeatmaps().length
    document.getElementById('viewport').innerHTML = CanvasView(maxFrame)
    const $timeSlider = document.getElementById('timeSlider');
    const $timestepInput = document.getElementById('timestepInput');
    const $playPause = document.getElementById('playPause');

    // Add event listeners
    $timeSlider.addEventListener('input', sliderHandler);
    $timestepInput.addEventListener('input', timestepInputHandler);
    $playPause.addEventListener('click', playPauseHandler);

    const $download = document.getElementById('download');
    $download.addEventListener('click', downloadHandler);
}

let playing = false;
let playInterval;

function sliderHandler() {
    const $timeSlider = document.getElementById('timeSlider');
    const $timestepInput = document.getElementById('timestepInput');
    const timestep = $timeSlider.value;
    $timestepInput.value = timestep;
    updateHeatmap(timestep);
}

function timestepInputHandler() {
    const $timeSlider = document.getElementById('timeSlider');
    const $timestepInput = document.getElementById('timestepInput');
    totalSteps = active_heatmap.getHeatmaps().length
    const timestep = Math.min(Math.max(0, $timestepInput.value), totalSteps);
    $timeSlider.value = timestep;
    updateHeatmap(timestep);
}

function playPauseHandler() {
    const $timeSlider = document.getElementById('timeSlider');
    const $timestepInput = document.getElementById('timestepInput');
    const $playPause = document.getElementById('playPause');
    playing = !playing;
    if (playing) {
        $playPause.textContent = "Pause";
        playInterval = setInterval(() => {
            let timestep = parseInt($timeSlider.value) + 1;
            totalSteps = active_heatmap.getHeatmaps().length
            if (timestep >= totalSteps) {
                timestep = 0;
            }
            $timeSlider.value = timestep;
            $timestepInput.value = timestep;
            updateHeatmap(timestep);
        }, 500); // Adjust the interval duration (in ms) as needed
    } else {
        $playPause.textContent = "Play";
        clearInterval(playInterval);
    }
}

function updateHeatmap(timestep) {
    heatmaps = active_heatmap.getHeatmaps()
    if (heatmaps && heatmaps.length > 0) {
        const heatmapData = heatmaps[timestep];
        // Render heatmap data on the canvas, depending on the library or method used
        active_heatmap.drawHeatMap(heatmapData)

    }
}

function downloadHandler() {
    const heatmaps = active_heatmap.getHeatmaps();
    const jsonString = JSON.stringify(heatmaps);
    const dataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);
    const link = document.createElement('a');
    link.setAttribute('href', dataURI);
    link.setAttribute('download', 'heatmaps.json');
    link.click();
}















