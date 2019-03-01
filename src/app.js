const CitySelector = require('./CitySelector');
const CityPointer = require('./CityPointer');

// Пример создания компонента:
const citySelector = new CitySelector({
    elementId: 'citySelector',
    regionsUrl: 'http://localhost:3000/regions',
    localitiesUrl: 'http://localhost:3000/localities',
    saveUrl: 'http://localhost:3000/selectedRegions'
});

const cityPointer = new CityPointer({
    elementId: 'info',
    selectorId: 'citySelector'
});

$('#createCitySelector').on('click', () => {
   citySelector.init();
});

$('#destroyCitySelector').on('click', () => {
    citySelector.destroy();
});



