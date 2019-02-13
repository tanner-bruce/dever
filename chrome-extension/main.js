function makeDiv(text) {
    var div = document.createElement('div');
    div.innerHTML = text.trim();
    return div.firstChild
}

function addButton(uri, revision, selector) {
    document.querySelector(selector).appendChild(makeDiv(text));
    document.getElementById("dever-btn").addEventListener('click', fn(uri, revision));
}

function fn(uri, rev) {
    return function() {
        const Http = new XMLHttpRequest();
        const url = `http://localhost:8735/clone?uri=${uri}&revision=${rev}`;
        Http.open("POST", url);
        Http.send();
        Http.onreadystatechange = (e) => {
            console.log(Http.responseText);
        }
    }
}

if (document.querySelector("meta[content='GitLab']") !== null) {
    gitlab()
}

if (document.querySelector("meta[content='GitHub']") !== null) {
    github()
}

function github() {
    try {
        uri = encodeURI(document.querySelector(".ssh-clone-options .form-control").value);
        revision = encodeURI(document.querySelector("details.branch-select-menu summary.select-menu-button").title);
        text = `<div class="BtnGroup">
    <a id="dever-btn" href="#" class="btn btn-sm empty-icon float-right BtnGroup-item btn-primary">Dever</a>
</div>`;
        addButton(uri, revision, ".file-navigation");

    } catch (e) {
        console.log("github error:");
        console.log(e)
    }
}

function gitlab() {
    let uri;
    try {
        try {
            uri = document.querySelector("meta[property='og:url']").content.replace("https://", "git@").split("/tree")[0].replace(/\//, ":") + ".git";
        } catch (e) {
        }
        if (uri === "") {
            uri = encodeURI(document.querySelector("input[name='project_clone']").value);
        }

        revision = encodeURI(document.querySelector("button.js-project-refs-dropdown").innerText);
        text = `<div class="d-none d-sm-inline-flex">
    <div class="project-action-button inline">
        <button id="dever-btn" aria-label="Dever" class="btn" data-display="static" title="dever" data-original-title="Dever"> 
            <i aria-hidden="true" data-hidden="true" class="fa fa-save"></i>
            Dever
        </button>
    </div>
</div>`;
        addButton(uri, revision, ".tree-controls");
    } catch (e) {
        console.log("gitlab error:");
        console.log(e)
    }

    try {
        document.querySelector(".text-secondary.prepend-top-8").remove();
        document.querySelector(".nav-links").lastElementChild.remove();
    } catch (e) {
    }
}