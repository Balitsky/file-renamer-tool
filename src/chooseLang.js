import $ from "jquery";
import { ipcRenderer } from "electron";

const toggleMap = new Map();

class ToggleElement {
    constructor(stateName, active) {
        this.glowText = $('#' + stateName);
        this.toggleNumberText = $('.toggle#' + stateName + ' .toggle-text-on');
        this.toggleButton = $('.toggle#' + stateName);
        this.active = false;
        this.stateName = stateName;

        addClickHandler(this);
        if(active){
            console.log(active);
            this.toggleButton.trigger('click');
        }
    }
}

function addClickHandler(toggle) {
    toggle.toggleButton.on('click', function (e) {
        $(this).toggleClass('toggle-on');
        $('.sign_word#' + toggle.stateName).toggleClass('active_glow');
        toggle.active = !toggle.active
        // reliseStates(toggleMap);
    });
}

function createTableElement(lang) {
    return "<tr><td>"
        + "<div class='interactive toggle' id='" + lang + "'><div class='toggle-text-off'>OFF</div><div class='glow-comp'></div><div class='toggle-button'></div><div class='toggle-text-on'>ON</div></div>" + "</td><td>"
        + "<div class='sign_word' id='" + lang + "'>" + lang.toUpperCase() + "</div>" + "</td>"
}

ipcRenderer.on('langs-option', (e, params) => {
    params.langsOption.forEach((lang) => {
        $("#table_body tr:last").after(createTableElement(lang))
        toggleMap.set(lang, new ToggleElement(lang, params.cacheLangs.includes(lang)))
    })
})

function apply() {
    var activeLangs = Array.from(toggleMap.values())
        .filter((value) => value.active)
        .map((value) => value.stateName)
    ipcRenderer.send('apply-langs', { langs: activeLangs })
    window.close();
}