class CityPointer {
    constructor(options) {
        this.$elem = $('#' + options.elementId);
        this.selectorId = options.selectorId;
        this.$region = this.$elem.find('#regionText');
        this.$city = this.$elem.find('#localityText');
        this._init();
    }

    _init() {
        $(document).on('createSelector_' + this.selectorId, () => {
            this._show();
            this.$region.html('');
            this.$city.html('');
        });

        $(document).on('changeStateSelector_' + this.selectorId, (event, region, city) => {
            if (region) {
                this.$region.html(region);
            } else {
                this.$region.html('');
            }

            if (city) {
                this.$city.html(city)
            } else {
                this.$city.html('');
            }
        });

        $(document).on('destroySelector_' + this.selectorId, () => {
            this.$region.html('');
            this.$city.html('');
            this._hide();
        });
    }

    _hide() {
        this.$elem.addClass('_hidden');
    }

    _show() {
        this.$elem.removeClass('_hidden');
    }


}

module.exports = CityPointer;
