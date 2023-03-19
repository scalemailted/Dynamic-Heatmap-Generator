const GeneralOptionsForm = (optionsList) => (`
    <div>
        <h4> General Options: </h4>
        ${OptionsForm(optionsList)}
    </div>
`)

const SpecificOptionsForm = (selected, optionsList) => (`
    <div>
        <h4>Options: ${selected}</h4>
        ${OptionsForm(optionsList)}
    </div>
`)



const OptionsForm = (optionsList) => (
    `<form class="row mb-4">
        ${ optionsList.map( (attrObj) => initOption(attrObj) ).join() }
        <hr class='mt-3' />
    </form>`
)

const Option = (htmlId, htmlText, value, etc={}) => {
    const etcString = stringifyAttributes(etc);
    return `
        <div class="col-md-2">
            <label for="${htmlId}" class="form-label">${htmlText}:</label>
            <input type="number" id="${htmlId}" class="form-control" value="${value}" ${etcString}>
        </div>`;
};


const initOption = (attrObj) => {
    const attrList = Object.values(attrObj)
    return Option(...attrList)
}

const stringifyAttributes = (attributes) => {
    return Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
};




