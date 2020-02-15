function createTable(violationss, page) {
    console.log('inside createTable');
    if (!violationss.length) {
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
    let table = '<table border=2 style="border-collapse: collapse;" id="' + page + '"><thead>';
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
    for (let i = 0; i < violationss.length; i++) {
        const violation = violationss[i];
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
    table += '</tbody></table>';
    return table;
}


function createAccordion(cb) {
    let pages = "";
    pages += `<div class="pageinfo"><p>Activity Title: <span>${title}</span></p><p>Activity URL: <span>${url}</span></p></div>`;
    for (let page in violations) {
        console.log('inside createAccordion[for loop]: ', page);
        const item = violations[page];
        if (item.error) {
            pages += `<button class='accordion' id=${page}>${mapping[page]}</button><div class='panel'><p class='page-violations'>Error while assessing, unable to test current page</p></div>`;
        } else if (!item.error) {
            let check = item.result.length == 1 ? "issue" : "issues";
            pages += `<button class='accordion' id=${page}>${mapping[page]} (${item.result.length} ${check})</button><div class='panel'>${createTable(item.result, page)}</div>`;
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