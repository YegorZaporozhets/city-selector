require('./style.less');

class CitySelector {
    constructor(options) {
        this.$elem = $('#' + options.elementId);
        this.regionsUrl = options.regionsUrl;
        this.localitiesUrl = options.localitiesUrl;
        this.saveUrl = options.saveUrl;
        this.cacheCities = [];
        this._selectedRegion = null;
        this._selectedCity = null;
    }

    init() {
        this.$containerToShowState = $('#info');
        this.$containerToShowRegion = this.$containerToShowState.find('#regionText');
        this.$containerToShowCity = this.$containerToShowState.find('#localityText');
        this._createComponentMarkup();
    }

    destroy() {
        this.$elem.html('');
        this._clearAndHideState();
    }

    _clearAndHideState() {
        this.$containerToShowState.addClass('_hidden');
        this._selectedRegion = null;
        this._selectedCity = null;
        this._updateState();
    }

    _showState() {
        this.$containerToShowState.removeClass('_hidden');

        this._updateState();
    }

    _updateState() {
        if (this._selectedRegion) {
            this.$containerToShowRegion.html(this._selectedRegion);
        } else {
            this.$containerToShowRegion.html('');
        }

        if (this._selectedCity) {
            this.$containerToShowCity.html(this._selectedCity);
        } else {
            this.$containerToShowCity.html('');
        }
    }

    _initComponentEvents() {
        this.$selectRegionBtn.on('click', () => {
            this.$selectRegionBtn.addClass('_hidden');

            this._createRegionsSelector();
        });

        this.$regionsSelector.on('click', ev => {
            const $target = $(ev.target);
            const regionId = $target.attr('data-region-id');

            if (regionId) {
                this._createCitiesSelector(regionId);
            } else {
                return;
            }

            this.$saveSelect
                .removeClass('_hidden')
                .attr('disabled', '');

            this.$regionsSelector.find('._selected').removeClass('_selected');

            $target.addClass('_selected');

            this._selectedRegion = regionId;
            this._selectedCity = null;

            this._updateState();
        });

        this.$citiesSelector.on('click', ev => {
            const $target = $(ev.target);
            let cityIndex = $target.attr('data-city-id');

            if (!cityIndex) return;

            let regionId = this._selectedRegion;

            this.$saveSelect.removeAttr('disabled');
            this.$citiesSelector.find('._selected').removeClass('_selected');
            $target.addClass('_selected');

            this._selectedCity = this.cacheCities
                .find(item => item.id === regionId).list[cityIndex];

            this._updateState();
        });

        this.$saveSelect.on('click', () => this._saveAndSendLocality.call(this));
    }

    get state() {
        return {
            id: this._selectedRegion,
            locality: this._selectedCity
        }
    }

    _saveCitiesCache(cities) {
        if (!this.cacheCities.some(item => item.id === cities.id)) {
            this.cacheCities.push(cities);
        }
    }

    _createComponentMarkup() {
        this.$elem.html(`
            <div><input data-start-select-region type="button" value="Выбрать регион"></div>
            <div data-regions-selector></div>
            <div data-cities-selector></div>
            <div><input data-save-select class="_hidden" disabled type="button" value="Сохранить"></div>
        `);

        this.$regionsSelector = this.$elem.find('[data-regions-selector]');
        this.$citiesSelector = this.$elem.find('[data-cities-selector]');
        this.$selectRegionBtn = this.$elem.find('[data-start-select-region]');
        this.$saveSelect = this.$elem.find('[data-save-select]');

        this._initComponentEvents();
        this._showState();
    }

    _createRegionsSelectorMarkup(regions) {
        let list = regions
            .map(region => `<li data-region-id="${region.id}">${region.title}</li>`)
            .join('');
        let markup = `<ul>${list}</ul>`;

        this.$regionsSelector.html(markup);
    }

    _createCitiesSelectorMarkup(cities) {
        this._saveCitiesCache(cities);

        let list = cities.list
            .map((city, index) => `<li data-city-id="${index}">${city}</li>`)
            .join('');
        let markup = `<ul>${list}</ul>`;

        this.$citiesSelector.html(markup);
    }

    _getData(url, createMarkup) {
        $.ajax({
            url: url,
            dataType: 'json'
        })
            .done(resp => createMarkup.call(this, resp));
    }

    _createRegionsSelector() {
        this._getData(this.regionsUrl, this._createRegionsSelectorMarkup);
    }

    _createCitiesSelector(regionId) {
        if (this.cacheCities.some(item => item.id === regionId)) {
            let currentCities = this.cacheCities.find(item => item.id === regionId);

            this._createCitiesSelectorMarkup(currentCities, this.$citiesSelector);
        } else {
            this._getData(`${this.localitiesUrl}/${regionId}`, this._createCitiesSelectorMarkup);
        }
    }

    _saveAndSendLocality() {
        const DATA_TO_SEND = {
            regionId: this._selectedRegion,
            locality: this._selectedCity
        };

        $.ajax({
            type: 'POST',
            url: this.saveUrl,
            data: DATA_TO_SEND,
            async: false
        })
            .done(() => {
                this.$elem.html(`Вы выбрали город ${DATA_TO_SEND.locality}.`);
            })
            .fail(() => {
                this.$elem.append(`Что-то пошло не так, попробуйте еще раз :(`);
            });
    }
}

module.exports = CitySelector;
