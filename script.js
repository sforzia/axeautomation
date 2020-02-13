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
        console.log(popupData);
        document.getElementById("popup").innerHTML = popupData;
        document.getElementById("popup").classList.add("show-popup");
    }
}


const createAccordion = cb => {
    let pages = "";
    for (let page in violations) {
        const item = violations[page];
        if (item.error) {
            pages += `<button class='accordion' id=${page}>${mapping[page]}</button><div class='panel'></div><p class='page-violations'>Error while assessing, unable to test current page</p>`;
        } else {
            let check = item.result.length == 1 ? "issue" : "issues";
            pages += `<button class='accordion' id=${page}>${mapping[page]}</button><div class='panel'><p class='page-violations'>${item.result.length} ${check}</p></div>`;
        }
    }
    document.getElementById('parent').innerHTML = pages;
    if (cb && typeof cb === 'function') {
        addEventListenersToAccordion();
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