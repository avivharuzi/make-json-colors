"use strict";

let schemaCounter = 1;

$("#addColorSchema").on("click", function () {
    schemaCounter++;
    $("#colorsForm").append(`
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <h5 class="text-center text-secondary m-3">Color Schema #${schemaCounter}</h5>
                <div class="form-group">
                    <div class="row">
                        <div class="col-lg-6">
                            <input type="text" name="schemaName" class="form-control" placeholder="Color Schema Name">
                        </div>
                        <div class="col-lg-6">
                            <input type="text" name="mainHex" class="form-control" placeholder="Main Hex">
                        </div>
                    </div>
                </div>
                <textarea class="form-control mb-3" name="hexSchema" placeholder="Hex Colors"></textarea>
            </div>
        </div>
    `);
});

$("#setColors").on("click", function () {
    let checkColors = checkFormColors();
    if (checkColors.response === true) {
        setColors();
        $("#messageForm").empty();
    } else {
        generateAlert(checkColors.errors, $("#messageForm"));
    }
});

function setColors() {
    let schemaNames = $("input[name=schemaName]");
    let mainHexSchemas = $("input[name=mainHex]");
    let hexSchemas = $("textarea[name=hexSchema]");

    let output = "[";

    for (let i = 0; i < schemaNames.length; i++) {
        let colorSchema = "";

        let schemaName = schemaNames[i].value;
        let hexSchema =  hexSchemas[i].value;
        let mainHex = mainHexSchemas[i].value;

        let mainColor = getColorsConversions(mainHex, "500", schemaName);

        colorSchema += `{ "name": "${mainColor.name}", "weight": "${mainColor.weight}", "hex": "${mainColor.hex}", "rgb": "${mainColor.rgb}", "hsl": "${mainColor.hsl}", "cmyk": "${mainColor.cmyk}", "children": [`;

        hexSchema = hexSchema.split(/\s+/);

        for (let l = 0; l < hexSchema.length; l++) {
            let weight = getWeight(l + 1);
            let colors = getColorsConversions(hexSchema[l], weight);

            if (l === hexSchema.length - 1) {
                colorSchema += JSON.stringify(colors);
            } else {
                colorSchema += JSON.stringify(colors) + ",";
            }
            
        }

        if (i === schemaNames.length - 1) {
            colorSchema += `] }`;
        } else {
            colorSchema += `] },`;
        }
        
        output += colorSchema;
    }

    output += "]";

    $("#result").html(output);
    $("#mainResult").show();
}

function checkFormColors() {
    let errors = [];
    let schemaNames = $("input[name=schemaName]");
    let mainHexSchemas = $("input[name=mainHex]");
    let hexSchemas = $("textarea[name=hexSchema]");
    
    const REG_HEX = /^[#]{1}[a-fA-F0-9]{6}$/;
    const REG_STR = /^[a-zA-Z ]*$/;

    for (let i = 0; i < schemaNames.length; i++) {
        if (schemaNames[i].value === "") {
            errors.push(`Schema name is required`);
        } else if (!REG_STR.test(schemaNames[i].value)) {
            errors.push(`This schema name "${schemaNames[i].value}" is invalid`);
        }

        if (mainHexSchemas[i].value === "") {
            errors.push(`Main hex is required`);
        } else if (!REG_HEX.test(mainHexSchemas[i].value)) {
            errors.push(`This main hex "${mainHexSchemas[i].value}" is invalid`);
        }

        let hexSchema = hexSchemas[i].value.split(/\s+/);

        for (let l = 0; l < hexSchema.length; l++) {
            if (hexSchema[l] === "") {
                errors.push(`Hex schema is required`);
            } else if (!REG_HEX.test(hexSchema[l])) {
                errors.push(`This hex "${hexSchema[l]}" is invalid from "${schemaNames[i].value}"`);
            }
        }
    }

    if (errors.length) {
        return {
            response: false,
            errors: errors
        }
    } else {
        return {
            response: true
        };
    }
}

$(".btn-copy").on("click", function () {
    let text = $(this).next().text();
	copyToClipboard(text);
});

function copyToClipboard(text) {
	let aux = document.createElement("input");
	aux.setAttribute("value", text);
	document.body.appendChild(aux);
	aux.select();
	document.execCommand("copy");
	document.body.removeChild(aux);
}

function generateAlert(errors, element) {
    let output = 
    `<div class="alert alert-danger alert-dismissible fade show">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;

    $(errors).each(function (index, value) {
        output += `<p class="lead"><i class="fa fa-exclamation-circle mr-2"></i>${value}</p>`;
    });

    output += "</div>";

    element.html(output);
}
