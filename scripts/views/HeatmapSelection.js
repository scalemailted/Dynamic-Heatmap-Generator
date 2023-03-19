const HeatmapSelection = () => (`
    <div class="row mb-3">
        <div class="col-1 text-right">
            <label for="type" class="col-form-label">Type:</label>
        </div>
        <div class="col-7">
            <select id="heatmap-type" class="form-select">
                <option disabled selected value> -- select an option -- </option>
                <option value="evo-spatial">Evolutionary Heatmap with Spatial Rules</option>
                <option value="evo-temporal">Evolutionary Heatmap with Temporal Rules</option>
                <option value="rnd-weight-none">Randomly Weighted Heatmap with No Constraints</option>
                <option value="rnd-weight-proximity">Randomly Weighted Heatmap with Proximity Constraints</option>
            </select>
        </div>
        <div class="col-md-3 mt-3 mt-md-0">
            <button id="submit" class="btn btn-primary">Generate</button>
        </div>
        <hr class='mt-3'>
    </div>
`)

const getOptionsList = (name) => {
    switch(name){
        case 'conway': return optionsListConway;
        case 'random': return optionsListRandom;
    }
}

const initParam = (id,text,val,etc) => (
    {htmlId: id, htmlText: text, value: val, etc}
)

optionsListGeneral = [
    initParam(id='length',text='Rows',val=50),
    initParam(id='width',text='Columns',val=50),
    initParam(id='cellSize',text='Cell Size',val=10),
    initParam(id='snapshots',text='Snapshots',val=20)
]

optionsListConway = [
    initParam(id='pAlive',text='P(Alive)',val=0.5, etc={min:0, max:1})
]

optionsListRandom = [
    initParam(id='hotThreshold',text='Hot at',val=0.95, etc={min:0, max:1}),
    initParam(id='warmThreshold',text='Warm at',val=0.8, etc={min:0, max:1}),
    initParam(id='coolThreshold',text='Cool at',val=0.4, etc={min:0, max:1})
]


evo_spatial_text =  () => (`
    The Evolutionary Heatmap with Spatial Rules employs Conway's Game of Life 
    from cellular automata as its evolution ruleset, 
    in which the current state is influenced by previous states. 
    The heatmap's classification from hot to cold is determined by 
    the number of living neighbors, giving rise to dynamic temporal patterns. 
    This model emphasizes spatial influence when selecting hot zones, 
    reducing temporal considerations and resulting in increased temporal variability. 
    Dynamical models that showcase both evolutionary behavior 
    and higher temporal variability frequently involve 
    intricate interactions and non-linear processes. 
    This behavior can be observed in real-world datasets such as 
    fluid flow systems, diffusion-based models, spatial predator-prey interactions, 
    and spreading of diseases or information within populations.
`)

evo_temporal_text = () => (`
    The Evolutionary Heatmap with Temporal Rules employs Conway's Game of Life 
    from cellular automata as its evolution ruleset, 
    in which the current state is influenced by previous states. 
    The heatmap's classification from hot to cold is determined by 
    a temporal rule: if a cell is alive in the current frame and the next frame, 
    it's considered hot. 
    A secondary spatial rule for warmth is based on the number of living neighbors. 
    This model emphasizes temporal influence when selecting hot zones, 
    while also incorporating a secondary spatial consideration, 
    resulting in increased temporal stability between frames. 
    Dynamical models that showcase both evolutionary behavior and 
    higher temporal stability often involve time-dependent interactions and processes. 
    This behavior can be observed in real-world datasets such as 
    population dynamics, ecosystem succession, supply chain management, 
    and traffic congestion patterns.
`)

rnd_weight_none = () => (`
    The Randomly Weighted Heatmap with No Constraints uses a random weighted distribution 
    for hot, warm, cool, and cold cells, with current states independent of prior states. 
    Cells are classified based on a generated real number (0 to 1) using cascading threshold checks. 
    This results in heatmaps with random hot spots and no consistent clustering, 
    exhibiting high temporal and spatial variability. 
    Such behavior occurs in systems lacking identifiable historical or community patterns 
    and is found in real-world datasets like sinkholes, violent crime occurrences, 
    and unpredictable accidents or emergencies.
`)

rnd_weight_proximity = () => (`
    The Randomly Weighted Heatmap with Proximity Constraints uses a random weighted distribution 
    for hot, warm, cool, and cold cells, with current states independent of prior states. 
    Cells are classified based on a generated real number (0 to 1), using cascading threshold checks. 
    An additional spatial constraint ensures hot cells are surrounded by warm cells. 
    This produces heatmaps with random hot spots and consistent warm cell clustering, 
    exhibiting an observable clustering pattern with high temporal and spatial variability. 
    Such behavior is found in systems that display observable community grouping 
    but lack historical repeatability.  
`)

heatmap_descriptions = ({
    "evo-spatial": evo_spatial_text(),
    "evo-temporal": evo_temporal_text(),
    "rnd-weight-none": rnd_weight_none(),
    "rnd-weight-proximity": rnd_weight_proximity()
})