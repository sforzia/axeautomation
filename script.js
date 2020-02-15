function show(page) {
    if (
        data &&
        page &&
        data[page] &&
        !data[page].error &&
        data[page].result &&
        data[page].result.length
    ) {
        let v = data[page].result;
        let popupData = '<p class="page-title">' + mapping[page] + '</p><div class="violations">';
        for (let iter = 0; iter < v.length; v++) {
            let _v = v[iter];
            popupData += '<div class="violation">';
            popupData += '<p class="description">Description: ' + _v.description + "</p>";
            popupData += '<p class="help">Help: ' + _v.help + "</p>";
            popupData += '<p class="impact">Impact: ' + _v.impact + "</p><p>Impacted nodes/elements:</p>";
            for (let iter2 = 0; iter2 < _v.nodes.length; iter2++) {
                let node = _v.nodes[iter2];
                popupData += '<div class="violation-node">';
                popupData += '<p class="f-summary">Failure Summary: ' + node.failureSummary + "</p>";
                popupData += '<p class="html">Node HTML: <xmp>' + node.html + "</xmp></p>";
                popupData += '<p class="identifier">Identifier(s): ' + node.target.join(" ") + "</p>";
            }
            popupData += '<p class="tags">WCAG tags: ' + _v.tags.join(", ") + "</p></div>";
        }
        popupData += "</div>";
        document.getElementById("popup").innerHTML = popupData;
        document.getElementById("popup").classList.add("show-popup");
    }
}

const createTable = (violations, page) => {
    if (!violations.length) {
        return "<p class='page-violations'>No issues found on selected page.</p>";
    }
    const headers = ['id', 'description', 'help', 'impact', 'tags', {
        'nodes': ['html']
    }];
    const headerMapping = {
        'id': 'ID',
        'description': "Description",
        'help': 'Help',
        'html': 'HTML Element',
        'impact': 'Impact',
        'tags': 'WCAG Tags'
    };
    let table = '<table border=2 style="border-collapse: collapse;" id=' + page + '><thead>';
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (typeof header == 'string') {
            table += '<th>' + headerMapping[header] + '</th>';
        } else if (typeof header == 'object') {
            const keys = Object.keys(header);
            for (let j = 0; j < keys.length; j++) {
                const key = keys[j];
                for (let k = 0; k < header[key].length; k++) {
                    const nestedHeader = header[key][k];
                    table += '<th class="' + key + '">' + headerMapping[nestedHeader] + '</th>';
                }
            }
        }
    }
    table += '</thead><tbody>';
    for (let i = 0; i < violations.length; i++) {
        const violation = violations[i];
        table += '<tr>';
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            if (typeof header == 'string') {
                if (header == 'tags') {
                    table += '<td><ul>';
                    for (let tagIter = 0; tagIter < violation[header].length; tagIter++) {
                        table += '<li>' + violation[header][tagIter] + '</li>';
                    }
                    table += '</ul></td>';
                } else {
                    table += '<td class="' + header + '">' + violation[header] + '</td>';
                }
            } else if (typeof header == 'object') {
                table += '<td>';
                const keys = Object.keys(header);
                for (let m = 0; m < keys.length; m++) {
                    const key = keys[m]; // nodes
                    if (violation[key].length > 1) {
                        table += '<ul>';
                        for (let k = 0; k < violation[key].length; k++) {
                            for (let l = 0; l < header[keys].length; l++) {
                                const nestedHeader = header[key][l];
                                table += '<li><xmp>' + violation[key][k][nestedHeader] + '</xmp></li>';
                            }
                        }
                        table += '</ul>';
                    } else {
                        for (let k = 0; k < violation[key].length; k++) {
                            for (let l = 0; l < header[keys].length; l++) {
                                const nestedHeader = header[key][l];
                                table += '<xmp>' + violation[key][k][nestedHeader] + '</xmp>';
                            }
                        }
                    }
                }
                table += '</td>';
            }
        }
        table += '</tr>';
    }
    table += '</tbody>';
    return table;
}


const createAccordion = cb => {
    let pages = "";
    pages += `<div class="pageinfo"><p>Activity Title: <span>${title}</span></p><p>Activity URL: <span>${url}</span></p></div>`;
    for (let page in violations) {
        const item = violations[page];
        if (item.error) {
            pages += `<button class='accordion' id=${page}>${mapping[page]}</button><div class='panel'><p class='page-violations'>Error while assessing, unable to test current page</p></div>`;
        } else if (!item.error) {
            let check = item.result.length == 1 ? "issue" : "issues";
            pages += `<button class='accordion' id=${page}>${mapping[page]} (${item.result.length} ${check})</button><div class='panel'>
                        ${createTable(item.result, page)}</div>`;
        }
    }
    document.getElementById('parent').innerHTML = pages;
    if (cb && typeof cb === 'function') {
        setTimeout(function () {
            addEventListenersToAccordion();
        }, 500);
    }
}

function addEventListenersToAccordion() {
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}

createAccordion(addEventListenersToAccordion);